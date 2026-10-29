# Linguistic Agent Handlers (GAP-02.4.3)

## Availability

The canonical catalog now has nine descriptors: the previous six unchanged,
two executable local linguistic analyses, and one deliberately disabled paid
translation descriptor. No tenant is activated automatically.

| Identity | Handler / capability | Runtime availability |
| --- | --- | --- |
| translation-agent | translation.proposal.v1 / translation.proposal | PAID_EXECUTION_DISABLED |
| terminology-lexicography-subagent | terminology.analyze.v1 / terminology.analyze | Local, after explicit human activation |
| semantic-fidelity-subagent | semantic.analyze.v1 / semantic.analyze | Local, after explicit human activation |

Operation IDs equal capability IDs; schema references append `.input.v1` and
`.output.v1`. These are DOCUMENT-scoped handlers with an additional required
`segmentId`, canonical `document.read`, `segment.read` and `translation.read`,
RESTRICTED classification, and a five-second
cooperative deadline. Allowed document workflow states are IN_TRANSLATION, IN_QA,
IN_SEMANTIC_REVIEW, and IN_REVIEW. They never advance workflow.

## Requests and Results

```json
{
  "agentId": "semantic-fidelity-subagent",
  "operationId": "semantic.analyze",
  "projectId": "project-id",
  "resource": { "type": "DOCUMENT", "id": "document-id" },
  "segmentId": "segment-id",
  "idempotencyKey": "unique-request-key"
}
```

Original source/target text and language metadata come only from the stored
segment. The API accepts no caller-supplied manuscript content or language override.
Results persist through the existing execution records and lifecycle audit.
They contain readiness (analysis completeness, never editorial approval), issue
codes, structured `findings` with code/severity/reference ID, numeric metrics,
and provenance. No source or translated text is copied into runtime results/audit.
The result always declares `humanApprovalRequired: true`.

Segment provenance uses SHA-256 over source, target, language/locale, translation
reference and update timestamp. Linguistic evidence records IDs and versions/hashes.
Execution completion and subsequent reads recheck access and exact evidence.
Changed content/resources or revoked access withhold the result; rerun under a
new idempotency key instead of silently updating historical evidence.

## Reused Services and Ownership

`LinguisticAgentAdapter` belongs to Translations and delegates terminology checks,
approved TM search, and semantic checks to the existing TerminologyService,
TranslationMemoryService, LexicographicService and SemanticFidelityService.
SegmentsService and DocumentsService resolve tenant-bound source records;
WorkspaceService checks both document and segment grants, plus linguistic resources.
No terminology validation, source modification, translation acceptance, workflow
approval, or editorial publication operation is invoked.

Existing glossary consultation now scopes ownership only for PERSONAL entries;
platform/project entries remain available regardless of their creator. Personal
entries from other users are excluded from term searches, and personal suggestions
are not sent as authoritative validated glossary instructions to the provider.
Glossary conflicts remain human review issues; TM never replaces approved terms.

The existing provider/cost services move to one internal AiTranslationProviderModule,
re-exported by AiGovernanceModule for API compatibility. Translations imports that
provider owner rather than the execution module. This removes the dependency cycle
without a second provider or cost service. Nest dependency initialization is tested
locally with an isolated runtime database.

## Fail-Closed Financial Boundary

The existing provider accounts usage after a request, permits retry/fallback calls,
and has no atomic cost/token reservation or authoritative per-attempt settlement.
The runtime's filesystem execution lock does not cover legacy provider endpoints
and is not a financial reservation ledger. It cannot guarantee concurrent budgets,
failed-attempt costs, or safe cancellation settlement across all spend paths.

The disabled translation descriptor additionally requires `translation.write`.
Consequently `translation.proposal.v1` is visible as a descriptor but cannot validate
an executable binding. Human activation, Creator privileges, credentials, environment
flags, and retries cannot bypass that gate. Direct adapter invocation also rejects
before calling TranslationsService.generateAiProposal. No runtime provider costs,
reservations, or duplicate provider accounting occur. Its zero cost estimate means
no execution is permitted, not that a provider call is free.

The intended integration is the existing generateAiProposal/central provider path,
including stored source/target policy, approved glossary/TM and explicit external
processing consent. Deterministic transport mocks test that existing path separately;
they do not prove paid runtime availability. Live generation is NOT VERIFIED.
Provider retries/timeouts are not changed. No provider request is launched under the
five-second runtime deadline. Enabling paid execution requires a separately approved
atomic ledger across spend paths, bounded estimates/token ceilings, retry reservations,
actual-cost settlement, cancellation propagation and compatible deadlines.

## Recovery and Limitations

Migration 0013 adds nullable immutable segment/consent request metadata and a composite
tenant/project/document/segment foreign key. Existing tasks remain valid. Both runtime
backup validators reject missing or mismatched segment references. No migration is
applied to staging or production by this change.

- Eight local handlers are executable, not nine. Paid translation is intentionally blocked.
- Existing lexical/TM APIs can consult broad candidate sets. All enabled dictionaries,
  pair-matching approved TM entries and selected glossary entries must be authorized
  before analysis; inaccessible candidates block analysis rather than silently leaking
  or omitting them. This conservative guard can block otherwise useful narrow queries.
- At most 200 evidence candidates are accepted; saturated glossary searches fail closed.
- Semantic omission detection is the existing deterministic heuristic, not a model claim.
- Semantic reports retain the existing in-memory semantic repository lifecycle. The
  sanitized runtime findings/provenance persist and survive backup/restore; this batch
  does not migrate the semantic repository or other legacy stores.
- Local deadlines/cancellation are cooperative. Existing linguistic services may finish
  analysis/audit work after cancellation, but cannot edit content and no cancelled
  runtime result is published. No distributed queue or multi-write transaction is added.
- SQL migration application requires an isolated PostgreSQL environment; static contract
  tests do not constitute proof of successful live migration.

## Local Validation Evidence

Validated on 2026-10-29 against base
`b88e01514d094c5c517d9170afb1d29b7e5b391b` on
`codex/gap-02-4-3-linguistic-agent-handlers`, without committing or publishing.

- Focused real-service handler integration suite: 33 passed, zero skipped.
- Full uncached workspace tests: API 624, DB 56, shared 62, web 134; zero failures.
- Uncached workspace lint, typecheck and production build passed. The existing
  AI package scripts required the bundled Python runtime on PATH locally;
  no package script or dependency was changed for that environment requirement.
- An isolated Nest application context initialized all nine descriptors, including
  the disabled translation descriptor, without a dependency cycle.
- Initial dependency audit at high severity passed with moderate `@hono/node-server`
  through MCP and low `deepmerge` through the Nest CLI. The follow-up remediation
  below removes the moderate finding without suppressing the low advisory.
- Infrastructure validation completed, but Docker, nginx, systemd-analyze,
  shellcheck and yamllint were unavailable; those optional native checks were not
  executed. PostgreSQL migration execution remains unverified.

Provider transport is mocked deterministically. The tests prove FR-to-RO proposals,
consent rejection, glossary/TM consultation, retry failure sanitization and unchanged
segments through the existing service/provider path. They do not claim paid runtime
execution or financial reservation support. Concurrent paid attempts are all denied
before provider invocation; no reservation or provider accounting is fabricated.

Other behavioral coverage includes semantic omissions, glossary conflicts, tenant
and segment restrictions, mid-execution grant revocation, idempotency pinned to segment,
invalid bindings/output, disabled versions, exhausted budgets, cancellation, deadlines,
exclusive execution, immutable lifecycle audit, and isolated backup/restore.

### Changed-File Inventory

Paths are repository-relative. The changes are confined to this handler integration,
its module wiring, persistence contract, tests and documentation.

- `apps/api/src/modules/ai-governance/ai-execution.service.ts`
- `apps/api/src/modules/ai-governance/ai-execution.types.ts`
- `apps/api/src/modules/ai-governance/ai-governance.module.ts`
- `apps/api/src/modules/ai-governance/ai-handler-registry.ts`
- `apps/api/src/modules/ai-governance/ai-handler.contract.ts`
- `apps/api/src/modules/ai-governance/ai-translation-provider.module.ts` (new)
- `apps/api/src/modules/terminology/terminology.repository.ts`
- `apps/api/src/modules/terminology/terminology.service.ts`
- `apps/api/src/modules/translations/translations.module.ts`
- `apps/api/src/modules/translations/translations.service.ts`
- `apps/api/src/modules/translations/linguistic-agent.adapter.ts` (new)
- `apps/api/tests/ai-governance-contract.test.mjs`
- `apps/api/tests/local-agent-handlers.integration.test.mjs`
- `packages/db/src/index.ts`
- `packages/db/src/runtime-database.ts`
- `packages/db/scripts/runtime-backup-lib.mjs`
- `packages/db/migrations/0013_linguistic_agent_task_inputs_v1.sql` (new)
- `packages/db/tests/linguistic-agent-task-inputs-migration.test.mjs` (new)
- `docs/modules/ai-orchestration/agent-capability-matrix.md`
- `docs/modules/ai-orchestration/agent-registry.md`
- `docs/modules/ai-orchestration/api-contracts.md`
- `docs/modules/ai-orchestration/execution-runtime.md`
- `docs/modules/ai-orchestration/local-handler-contract.md`
- `docs/modules/ai-orchestration/linguistic-handler-contract.md` (new)

## Dependency Security Follow-Up

GHSA-rmxm-3fg6-px4f affected installed `@hono/node-server@1.19.17` through
`@modelcontextprotocol/node@2.1.1`. That MCP release allowed only Hono's 1.x
adapter range. Upgrade MCP Node to 2.1.2, whose upstream dependency explicitly
accepts `^1.19.9 || ^2.1.3`, and its required server peer from 2.3.1 to 2.4.0
(including core 2.4.0). Pin the adapter to 2.1.3 with the narrowly scoped
`@modelcontextprotocol/node@2.1.2>@hono/node-server` override because pnpm otherwise
retains the vulnerable 1.x alternative. This is within upstream's supported range;
no AI handler or provider behavior is changed.

Additional remediation files: `apps/api/package.json`, `pnpm-workspace.yaml`,
`pnpm-lock.yaml`, and `apps/api/tests/mcp-node-security.integration.test.mjs`.
The latter uses a temporary loopback HTTP server and fixture tool, never the VPS
operations service, to verify the real `createMcpHandler`/`toNodeHandler` parsed-body
boundary, initialization, tool listing/calling and rejection before execution.

Frozen installation passed. Final unsuppressed audit reports zero critical, high
or moderate findings and one low `deepmerge` finding, GHSA-gcqx-w48m-w2h4, through
`@nestjs/cli > fork-ts-checker-webpack-plugin`. Plain `pnpm audit` returns exit 1
for that retained low finding; it is not an advisory-free result. Workspace tests
pass with API 625, DB 56, shared 62 and web 134. No live infrastructure was used.
