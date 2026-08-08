# Batch 06 Overview - Canonical Publishing Engine

Batch 06 establishes the canonical publishing engine foundation for layout,
PDF, EPUB, HTML, print validation, immutable packaging, and human publication
approval.

## Production Flow

Approved Master Document Version -> Edition -> Publication Readiness -> Layout
Profile -> Publication Build -> PDF/EPUB/Print/HTML -> Automated Validation ->
Human Validation -> Canonical Publication Package -> Publication Approval.

## No Second Editorial Source Of Truth

No second editorial source of truth is allowed. Every publication is generated
from:

- Canonical Work.
- Canonical Edition.
- Approved Master Document Version.
- Approved Metadata.
- Validated Rights.
- Publication Configuration.

Generated PDF, EPUB, HTML, and print files are derived outputs only. They must
never modify or replace the master document.

## Scope

Implemented in this batch:

- Shared canonical publishing engine contracts.
- Runtime persistence table inventory and backup coverage.
- JSON Master additive publication package fields.
- Contract tests and documentation.

Out of scope:

- Real PDF/EPUB rendering engine.
- External print/distribution providers.
- Public visibility changes.
- Docker, API controller, frontend, or schema migration changes.

