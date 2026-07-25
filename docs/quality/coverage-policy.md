# Coverage Policy

## Purpose

Coverage policy ensures meaningful test protection without treating raw
coverage percentage as a substitute for test quality.

## Coverage Dimensions

The platform tracks:

- Unit coverage.
- Domain coverage.
- Application/use-case coverage.
- API contract coverage.
- Database/migration coverage.
- Frontend route and component contract coverage.
- Security coverage.
- Accessibility coverage.
- AI workflow coverage.
- End-to-end critical path coverage.

## Current Baseline

Current tests provide broad contract coverage across API, Web, DB, and Shared
packages. Formal coverage reporting is not yet configured.

## Required Rules

- Critical domain rules must have direct tests.
- Critical workflow gates must have integration or contract tests.
- Critical UI flows must have route or end-to-end tests.
- Fixed defects must have regression tests.
- Coverage gaps must be risk-classified.
- Coverage thresholds should be introduced after baseline measurement.

## Non-Goals

- Do not inflate coverage with low-value tests.
- Do not duplicate tests across layers unless the same behavior requires
  different confidence at different boundaries.

## Acceptance Criteria

- Coverage reports exist for controlled release pipelines.
- Quality review prioritizes diagnostic value over percentage.
- High-risk untested code is tracked as a release risk.
