# Source conventions inspected

Inspected the current default-branch repository metadata, CodeRabbit settings, dependency update configuration and CI workflows in public `theaussiepom/homelab` and `theaussiepom/homelab-stack`. Authorised access also allowed inspection of `homelab-site` review/CI conventions. No private configuration or operational values were copied.

Adopted: Australian English; CHILL CodeRabbit reviews with finishing touches disabled; automatic PR reviews; SHA-pinned official Actions; read-only default workflow permissions; explicit runner/time limits; lockfile-based dependency installs; checksum-pinned Gitleaks scanning including Git history; meaningful failure conditions and synthetic fixtures; pull requests and squash merges; rulesets with verified checks, strict up-to-date branches, no bypass actors and resolved review threads.

Adapted: npm and Actions weekly Dependabot groups, static-site validation, browser accessibility checks and Cloudflare Git delivery. Did not copy infrastructure runners, deployment queues, service acceptance checks, private dependency pins or infrastructure coverage targets.

The public framework's protected-main ruleset was inspected directly. Its requirements include signed commits; this new repository can require signing after a working signing identity is established. The foundation does not claim unsigned local commits are signed. Review the acceptance record for the controls actually enabled on this repository.

Sources: [framework](https://github.com/theaussiepom/homelab), [stack](https://github.com/theaussiepom/homelab-stack). Private repository details intentionally omitted.

The current lint-tool graph required a transitive `minimatch` override to 11.0.5 to resolve its reported glob amplification denial-of-service vulnerability. This overrides older major constraints in build-only tooling; lint, type checks, build and browser validation must pass with it. Remove the override once upstream dependencies select a patched compatible version.
