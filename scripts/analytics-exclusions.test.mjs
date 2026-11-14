import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  settingsFromEnvironment,
  syncAnalyticsExclusions,
  run,
} from './sync-analytics-exclusions.mjs';

const zoneId = 'a'.repeat(32);
const rulesetId = 'b'.repeat(32);
const ruleId = 'c'.repeat(32);
const ref = 'homelab_blog_analytics_excluded_ips';
const env = {
  ANALYTICS_EXCLUDED_IPS: '192.0.2.7, 2001:db8::7',
  CLOUDFLARE_ZONE_ID: zoneId,
  CLOUDFLARE_ANALYTICS_API_TOKEN: 'synthetic-api-credential',
  SITE_URL: 'https://blog.example',
};
const unrelated = {
  id: 'd'.repeat(32),
  ref: 'unrelated_existing_rule',
  expression: 'http.host eq "other.example"',
  action: 'set_config',
  action_parameters: { automatic_https_rewrites: true },
  enabled: true,
};
const existing = () => ({
  id: rulesetId,
  kind: 'zone',
  phase: 'http_config_settings',
  rules: [structuredClone(unrelated)],
});
function api(initial) {
  let state = structuredClone(initial);
  const calls = [];
  let reads = 0;
  return {
    calls,
    state: () => structuredClone(state),
    fetch: async (url, options) => {
      const parsed = new URL(url);
      assert.equal(parsed.origin, 'https://api.cloudflare.com');
      assert.equal(options.redirect, 'error');
      assert.equal(
        options.headers.Authorization,
        `Bearer ${env.CLOUDFLARE_ANALYTICS_API_TOKEN}`,
      );
      const body = options.body ? JSON.parse(options.body) : undefined;
      calls.push({ method: options.method, path: parsed.pathname, body });
      if (options.method === 'GET') {
        reads += 1;
        if (state === null) return new Response('{}', { status: 404 });
        return Response.json({ success: true, result: state });
      }
      if (options.method === 'POST' && parsed.pathname.endsWith('/rulesets')) {
        assert.equal(state, null);
        state = {
          ...body,
          id: rulesetId,
          rules: body.rules.map((rule) => ({ ...rule, id: ruleId })),
        };
      } else if (
        options.method === 'POST' &&
        parsed.pathname.endsWith('/rules')
      ) {
        state.rules.push({ ...body, id: ruleId });
      } else if (
        options.method === 'PATCH' &&
        parsed.pathname.endsWith('/rules/' + ruleId)
      ) {
        state.rules = state.rules.map((rule) =>
          rule.id === ruleId ? { ...rule, ...body } : rule,
        );
      } else {
        assert.fail('Unexpected or whole-ruleset mutation');
      }
      assert(reads > 0, 'Read existing state before mutation');
      return Response.json({ success: true, result: state });
    },
  };
}

test('validate and normalise individual IPv4/IPv6 addresses and the configured origin', () => {
  const settings = settingsFromEnvironment({
    ...env,
    ANALYTICS_EXCLUDED_IPS: '2001:0db8:0:0:0:0:0:7\n192.0.2.7 2001:db8::7',
  });
  assert.deepEqual(settings.addresses, ['192.0.2.7', '2001:db8::7']);
  assert.equal(settings.hostname, 'blog.example');
  assert.equal(
    settingsFromEnvironment({ ...env, SITE_URL: undefined }).hostname,
    'theaussiepom.me',
  );
});

test('reject missing credentials, ranges and expression injection before contacting Cloudflare', async () => {
  for (const patch of [
    { ANALYTICS_EXCLUDED_IPS: '' },
    { ANALYTICS_EXCLUDED_IPS: '192.0.2.0/24' },
    { ANALYTICS_EXCLUDED_IPS: '192.0.2.7} or true' },
    { ANALYTICS_EXCLUDED_IPS: Array(33).fill('192.0.2.7').join(' ') },
    { CLOUDFLARE_ZONE_ID: 'invalid' },
    { CLOUDFLARE_ANALYTICS_API_TOKEN: '' },
    { CLOUDFLARE_ANALYTICS_API_TOKEN: 'invalid\nheader' },
    { SITE_URL: 'not a URL' },
    { SITE_URL: 'http://blog.example' },
    { SITE_URL: 'https://user:password@blog.example/' },
    { SITE_URL: 'https://blog.example/path' },
    { SITE_URL: 'https://blog.example/?query' },
  ]) {
    await assert.rejects(
      run(
        { ...env, ...patch },
        () => assert.fail('No API call allowed'),
        () => {},
      ),
    );
  }
});

test('create the phase only when absent and read back the exact narrow rule', async () => {
  const mock = api(null);
  const result = await syncAnalyticsExclusions(
    settingsFromEnvironment(env),
    mock.fetch,
  );
  assert.deepEqual(result, { outcome: 'created', addressCount: 2 });
  assert.deepEqual(
    mock.calls.map((call) => call.method),
    ['GET', 'POST', 'GET'],
  );
  const rule = mock.state().rules[0];
  assert.equal(rule.ref, ref);
  assert.equal(
    rule.expression,
    'http.host eq "blog.example" and ip.src in {192.0.2.7 2001:db8::7}',
  );
  assert.deepEqual(rule.action_parameters, { disable_rum: true });
});

test('append to an existing phase without replacing or changing another rule', async () => {
  const mock = api(existing());
  await syncAnalyticsExclusions(settingsFromEnvironment(env), mock.fetch);
  assert(mock.calls[1].path.endsWith('/' + rulesetId + '/rules'));
  assert.deepEqual(mock.state().rules[0], unrelated);
});

test('repeat is read-only, and changing the IP updates only the same owned rule', async () => {
  const mock = api(existing());
  const settings = settingsFromEnvironment(env);
  await syncAnalyticsExclusions(settings, mock.fetch);
  mock.calls.length = 0;
  assert.equal(
    (await syncAnalyticsExclusions(settings, mock.fetch)).outcome,
    'unchanged',
  );
  assert.deepEqual(
    mock.calls.map((call) => call.method),
    ['GET', 'GET'],
  );
  mock.calls.length = 0;
  const changed = settingsFromEnvironment({
    ...env,
    ANALYTICS_EXCLUDED_IPS: '198.51.100.9',
  });
  assert.equal(
    (await syncAnalyticsExclusions(changed, mock.fetch)).outcome,
    'updated',
  );
  assert.deepEqual(
    mock.calls.map((call) => call.method),
    ['GET', 'PATCH', 'GET'],
  );
  assert(mock.calls[1].path.endsWith('/rules/' + ruleId));
  assert.deepEqual(mock.state().rules[0], unrelated);
});

test('refuse collisions, unexpected settings and invalid identifiers without mutation', async () => {
  const setup = api(existing());
  await syncAnalyticsExclusions(settingsFromEnvironment(env), setup.fetch);
  for (const alter of [
    (state) => state.rules.push(structuredClone(state.rules[1])),
    (state) => {
      state.rules[1].action_parameters = { disable_rum: true, bic: false };
    },
    (state) => {
      state.rules[1].description = 'Not owned by this deployment';
    },
    (state) => {
      state.kind = 'root';
    },
    (state) => {
      state.id = '../another-zone';
      state.rules[1].enabled = false;
    },
  ]) {
    const state = setup.state();
    alter(state);
    const mock = api(state);
    await assert.rejects(
      syncAnalyticsExclusions(settingsFromEnvironment(env), mock.fetch),
    );
    assert(mock.calls.every((call) => call.method === 'GET'));
  }
});

test('reject unconfirmed writes and concurrent changes to other rules', async () => {
  for (const tamper of [
    (state) => {
      state.rules.find((rule) => rule.ref === ref).enabled = false;
    },
    (state) => {
      state.rules[0].enabled = false;
    },
  ]) {
    const mock = api(existing());
    let reads = 0;
    const fetch = async (...args) => {
      const response = await mock.fetch(...args);
      if (args[1].method === 'GET' && ++reads === 2) {
        const state = mock.state();
        tamper(state);
        return Response.json({ success: true, result: state });
      }
      return response;
    };
    await assert.rejects(
      syncAnalyticsExclusions(settingsFromEnvironment(env), fetch),
      /verification/,
    );
  }
});

test('API failures never disclose response bodies, credentials or excluded IPs', async () => {
  const privateText =
    env.CLOUDFLARE_ANALYTICS_API_TOKEN + ' ' + env.ANALYTICS_EXCLUDED_IPS;
  for (const fetch of [
    async () => {
      throw new Error(privateText);
    },
    async () => new Response(privateText, { status: 403 }),
    async () => new Response(privateText, { status: 200 }),
    async () =>
      Response.json({
        success: false,
        errors: [{ message: privateText }],
        result: {},
      }),
  ]) {
    await assert.rejects(
      syncAnalyticsExclusions(settingsFromEnvironment(env), fetch),
      (error) => {
        assert(!error.message.includes(env.CLOUDFLARE_ANALYTICS_API_TOKEN));
        assert(!error.message.includes('192.0.2.7'));
        return true;
      },
    );
  }
});

test('GitHub masks parameter values before API requests and logs only a count', async () => {
  const lines = [];
  const mock = api(existing());
  await run(
    { ...env, GITHUB_ACTIONS: 'true' },
    async (...args) => {
      assert(lines.includes('::add-mask::192.0.2.7'));
      return mock.fetch(...args);
    },
    (line) => lines.push(line),
  );
  assert.match(
    lines.at(-1),
    /^Analytics exclusion created and verified for 2 address\(es\)\.$/,
  );
  assert(lines.slice(0, -1).every((line) => line.startsWith('::add-mask::')));
});
