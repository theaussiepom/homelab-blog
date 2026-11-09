import { execFileSync } from 'node:child_process';
import { setTimeout } from 'node:timers/promises';

const sha = execFileSync('git', ['rev-parse', 'HEAD'], {
  encoding: 'utf8',
}).trim();
if (!/^[a-f0-9]{40}$/.test(sha)) throw new Error('Invalid checkout revision.');
if (
  process.env.WORKERS_CI_COMMIT_SHA &&
  process.env.WORKERS_CI_COMMIT_SHA !== sha
) {
  throw new Error('Cloudflare commit does not match checkout.');
}
const site = new URL(process.env.SITE_URL || 'https://example.com');
if (
  site.protocol !== 'https:' ||
  site.hostname === 'example.com' ||
  site.pathname !== '/' ||
  site.search ||
  site.hash
) {
  throw new Error(
    'Set SITE_URL to the verified public HTTPS origin before production deployment.',
  );
}
const base = 'https://api.github.com/repos/theaussiepom/homelab-blog';
async function get(path) {
  const response = await fetch(`${base}/${path}`, {
    headers: {
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
    },
    signal: AbortSignal.timeout(15_000),
  });
  if (!response.ok)
    throw new Error(`GitHub CI gate failed: HTTP ${response.status}`);
  return response.json();
}
for (let attempt = 0; attempt < 20; attempt++) {
  const branch = await get('branches/main');
  if (branch.commit.sha !== sha)
    throw new Error('Only the current main revision can deploy to production.');
  const result = await get(
    `actions/workflows/ci.yml/runs?head_sha=${sha}&branch=main&event=push&per_page=10`,
  );
  const run = result.workflow_runs.find(
    (run) =>
      run.head_sha === sha &&
      run.event === 'push' &&
      run.head_branch === 'main',
  );
  if (run?.status === 'completed') {
    if (run.conclusion !== 'success')
      throw new Error(`CI rejected this revision: ${run.conclusion}`);
    console.log(`Production authorised by successful CI: ${run.html_url}`);
    process.exit(0);
  }
  if (attempt < 19) await setTimeout(30_000);
}
throw new Error(
  'Timed out waiting for successful CI; production deployment was blocked.',
);
