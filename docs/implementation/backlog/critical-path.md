# Critical Path

Status: Batch 01 P0/P1

## Immediate Sequence

1. Freeze baseline evidence.
2. Harden secret detection.
3. Establish canonical commands and CI gates.
4. Add shared config, logging, error, and localization foundations.
5. Add safe health endpoints.
6. Record ownership, configuration, security, rollback, and compliance evidence.
7. Run validation.
8. Propose Batch 02 for Identity/Auth/Authz/data isolation only after Batch 01 evidence is complete.

## Blockers to Release Candidate

- Tracked generated artifacts require owner-approved cleanup.
- Full i18n migration is not complete.
- Full CI evidence depends on dependency availability.
- Any discovered real secret requires rotation outside the repository before release.

## Batch 02 Candidate

Batch 02 should focus on Identity, Authentication, Authorization, session governance, and
data isolation validation. It must not start until Batch 01 validation evidence is
recorded.

