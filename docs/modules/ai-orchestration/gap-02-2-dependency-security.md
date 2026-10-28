# GAP-02.2 Dependency Security Review

Reviewed on 2026-10-28. This review changes no agent configuration or execution logic.

## Remediation

The existing workspace override for `qs` moves from 6.16.0 to 6.16.1.
This addresses GHSA-6pq8-jhm2-2vcw (CVE-2026-110816), reported as moderate
by pnpm audit. The affected path includes
`@nestjs/platform-express -> express -> qs`; body-parser also consumes qs.
The update stays within the existing major/minor release and preserves the
existing override mechanism.

## Residual Finding

- Package: `deepmerge@4.3.1`.
- Advisory: GHSA-gcqx-w48m-w2h4 / CVE-2026-93753.
- Registry audit severity: LOW; advisory CVSS score: 5.3.
- Exact path: API devDependency `@nestjs/cli@11.0.23` ->
  `fork-ts-checker-webpack-plugin@9.1.0` -> `deepmerge@4.3.1`.
- Cause: prototype poisoning of merge results when attacker-controlled objects
  are merged without appropriate key validation.

The plugin invokes deepmerge when merging external plugin configuration and
constructor options in `lib/plugin.js`. Exploitation therefore depends on
untrusted objects reaching this build-tool configuration path. This review
identified no application request handler importing this package; it does not
establish that dependency files are absent from deployed images. Existing
Dockerfiles perform a full workspace install, so devDependency classification
alone is not evidence of package exclusion from container filesystems.

Registry metadata confirms that compatible `@nestjs/cli@11.0.24` still depends
on plugin 9.1.0. The latest plugin is 9.1.0 and requires `deepmerge ^4.2.2`;
the latest deepmerge is 4.3.1, and the advisory lists no patched version.
Nest CLI 12.0.11 removes this plugin from its declared dependencies but also
changes major toolchain dependencies, including TypeScript 6 and Angular
DevKit 22. That migration has not been validated and is not a minimal fix.

No downgrade, package substitution, advisory suppression, or deepmerge override
is applied. Alternative merge packages are not assumed API/behavior compatible.
The low-severity finding remains visible in pnpm audit and is not formally
accepted or waived by this document.

Use trusted build configuration and plugins. Reassess when a patched deepmerge
or compatible upstream plugin/CLI release is published. Any replacement or CLI
major migration requires separate compatibility testing of Nest development,
watch, webpack, and build behavior.
