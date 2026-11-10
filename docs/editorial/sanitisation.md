# Public-content sanitisation

Every branch and commit can be copied indefinitely. Review the diff before pushing, including deleted lines and Git history.

1. Replace real hostnames with reserved example domains, and any example addresses with documentation-only ranges. Rebuild examples from synthetic data rather than exporting operational configuration.
2. Remove tokens, passwords, certificates, account and zone identifiers, private URLs, device identifiers, network topology and access mechanisms. Environment variable names may be documented; production values may not.
3. Capture screenshots in a synthetic environment. Inspect every visible field, tab, address bar, notification, QR code and metadata field. Remove sensitive content before export and inspect the exported image. Do not rely on a removable overlay.
4. Clearly state what was observed, inferred, tested and verified. Mark placeholders and unresolved questions. Never imply a procedure was exercised on a real system when only a build or synthetic example was tested.
5. Run all source and rendered-output checks. Secret scanners cannot prove that material is safe to publish; conduct human review too.
6. If a secret is exposed, revoke or rotate it first. Removing the current line does not remove history or copies. Coordinate any history remediation explicitly; do not disable scanning or add broad exclusions to hide a leak.

Use Australian English. Technical claims should cite current primary sources and state version/validation limits. Follow the [writing and publishing workflow](workflow.md) and its article templates. The current publication uses synthetic examples; real article production is a separate milestone. Draft status does not make source files, Git history or public preview links private.
