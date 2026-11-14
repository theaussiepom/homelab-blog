import { isIP } from 'node:net';
import { pathToFileURL } from 'node:url';
import { siteOrigin } from '../src/lib/site.mjs';

const phase = 'http_config_settings';
const ruleRef = 'homelab_blog_analytics_excluded_ips';
const description =
  'Managed by homelab-blog CD: exclude operator IPs from Web Analytics.';

class ConfigurationError extends Error {}

export function settingsFromEnvironment(env) {
  const raw = (env.ANALYTICS_EXCLUDED_IPS || '').trim();
  const entries = raw.split(/[\s,]+/).filter(Boolean);
  if (!entries.length || entries.length > 32) {
    throw new ConfigurationError(
      'ANALYTICS_EXCLUDED_IPS must contain 1–32 individual IP addresses.',
    );
  }
  const addresses = entries.map((entry) => {
    const family = isIP(entry);
    if (!family) {
      throw new ConfigurationError(
        'ANALYTICS_EXCLUDED_IPS contains an invalid address. CIDR ranges are not accepted.',
      );
    }
    return family === 6
      ? new URL(`http://[${entry}]/`).hostname.slice(1, -1)
      : entry;
  });
  const zoneId = (env.CLOUDFLARE_ZONE_ID || '').trim();
  if (!/^[a-f0-9]{32}$/i.test(zoneId)) {
    throw new ConfigurationError('CLOUDFLARE_ZONE_ID must be configured.');
  }
  const token = (env.CLOUDFLARE_ANALYTICS_API_TOKEN || '').trim();
  if (!token || /[\r\n]/.test(token)) {
    throw new ConfigurationError(
      'CLOUDFLARE_ANALYTICS_API_TOKEN must be configured.',
    );
  }
  let origin;
  try {
    origin = new URL(env.SITE_URL || siteOrigin);
  } catch {
    throw new ConfigurationError('SITE_URL must be an HTTPS origin.');
  }
  if (
    origin.protocol !== 'https:' ||
    origin.pathname !== '/' ||
    origin.search ||
    origin.hash ||
    origin.username ||
    origin.password
  ) {
    throw new ConfigurationError('SITE_URL must be an HTTPS origin.');
  }
  return {
    addresses: [...new Set(addresses)].sort(),
    maskValues: [...new Set([...entries, ...addresses, zoneId, token])],
    hostname: origin.hostname,
    zoneId,
    token,
  };
}

function ruleFor(settings) {
  return {
    ref: ruleRef,
    description,
    expression: `http.host eq ${JSON.stringify(settings.hostname)} and ip.src in {${settings.addresses.join(' ')}}`,
    action: 'set_config',
    action_parameters: { disable_rum: true },
    enabled: true,
  };
}

function validId(value) {
  if (typeof value !== 'string' || !/^[a-f0-9]{32}$/i.test(value)) {
    throw new ConfigurationError(
      'Cloudflare returned an invalid resource identifier.',
    );
  }
  return value;
}

function ownedRule(ruleset) {
  if (ruleset === null) return undefined;
  if (
    ruleset.phase !== phase ||
    ruleset.kind !== 'zone' ||
    !Array.isArray(ruleset.rules)
  ) {
    throw new ConfigurationError(
      'Cloudflare returned an unexpected configuration ruleset.',
    );
  }
  const matches = ruleset.rules.filter((rule) => rule.ref === ruleRef);
  if (matches.length > 1) {
    throw new ConfigurationError(
      'Multiple managed analytics rules found; no changes made.',
    );
  }
  const owned = matches[0];
  if (
    owned &&
    (owned.description !== description ||
      owned.action !== 'set_config' ||
      JSON.stringify(owned.action_parameters) !==
        JSON.stringify({ disable_rum: true }))
  ) {
    throw new ConfigurationError(
      'Managed rule ownership or settings changed; refusing to overwrite it.',
    );
  }
  return owned;
}

function otherRules(ruleset) {
  return JSON.stringify(
    (ruleset?.rules || [])
      .filter((rule) => rule.ref !== ruleRef)
      .map((rule) => {
        const semantic = { ...rule };
        delete semantic.version;
        delete semantic.last_updated;
        return semantic;
      }),
  );
}

export async function syncAnalyticsExclusions(settings, fetchImpl = fetch) {
  const prefix = `/zones/${settings.zoneId}/rulesets`;
  const entrypoint = `${prefix}/phases/${phase}/entrypoint`;
  async function request(method, path, body, allowMissing = false) {
    let response;
    try {
      response = await fetchImpl(
        `https://api.cloudflare.com/client/v4${path}`,
        {
          method,
          redirect: 'error',
          signal: AbortSignal.timeout(15000),
          headers: {
            Authorization: `Bearer ${settings.token}`,
            'Content-Type': 'application/json',
          },
          ...(body ? { body: JSON.stringify(body) } : {}),
        },
      );
    } catch {
      throw new ConfigurationError('Cloudflare request failed or timed out.');
    }
    if (allowMissing && response.status === 404) return null;
    if (!response.ok) {
      throw new ConfigurationError(
        `Cloudflare request failed (HTTP ${response.status}).`,
      );
    }
    let data;
    try {
      data = await response.json();
    } catch {
      throw new ConfigurationError('Cloudflare returned an invalid response.');
    }
    if (
      data?.success !== true ||
      !data.result ||
      typeof data.result !== 'object'
    ) {
      throw new ConfigurationError('Cloudflare did not confirm the request.');
    }
    return data.result;
  }

  const before = await request('GET', entrypoint, undefined, true);
  const owned = ownedRule(before);
  const desired = ruleFor(settings);
  let outcome = 'unchanged';
  if (before === null) {
    await request('POST', prefix, {
      name: 'Blog analytics configuration',
      kind: 'zone',
      phase,
      rules: [desired],
    });
    outcome = 'created';
  } else if (!owned) {
    await request('POST', `${prefix}/${validId(before.id)}/rules`, desired);
    outcome = 'created';
  } else if (
    Object.keys(desired).some(
      (key) => JSON.stringify(owned[key]) !== JSON.stringify(desired[key]),
    )
  ) {
    await request(
      'PATCH',
      `${prefix}/${validId(before.id)}/rules/${validId(owned.id)}`,
      desired,
    );
    outcome = 'updated';
  }
  const after = await request('GET', entrypoint);
  const verified = ownedRule(after);
  if (
    !verified ||
    Object.keys(desired).some(
      (key) => JSON.stringify(verified[key]) !== JSON.stringify(desired[key]),
    )
  ) {
    throw new ConfigurationError(
      'Analytics exclusion read-back verification failed.',
    );
  }
  if (otherRules(before) !== otherRules(after)) {
    throw new ConfigurationError(
      'Other configuration rules changed during verification; inspect before retrying.',
    );
  }
  return { outcome, addressCount: settings.addresses.length };
}

export async function run(
  env = process.env,
  fetchImpl = fetch,
  log = console.log,
) {
  const settings = settingsFromEnvironment(env);
  if (env.GITHUB_ACTIONS === 'true') {
    for (const value of settings.maskValues) log(`::add-mask::${value}`);
  }
  const result = await syncAnalyticsExclusions(settings, fetchImpl);
  log(
    `Analytics exclusion ${result.outcome} and verified for ${result.addressCount} address(es).`,
  );
  return result;
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  run().catch((error) => {
    console.error(
      error instanceof ConfigurationError
        ? error.message
        : 'Analytics exclusion failed.',
    );
    process.exitCode = 1;
  });
}
