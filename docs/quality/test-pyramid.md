# Test Pyramid

## Purpose

The test pyramid controls test distribution so the platform remains fast,
diagnostic, and reliable.

## Official Pyramid

```text
        UI Tests
    -----------------
   Integration Tests
-------------------------
      Unit Tests
```

## Unit Tests

Unit tests should be the majority.

They verify:

- Pure rules.
- Helpers.
- Value objects.
- Domain policies.
- Validation functions.

They must avoid:

- Network.
- Database.
- Filesystem.
- AI provider calls.
- Full application boot.

## Integration and Contract Tests

Integration and contract tests verify:

- Module collaboration.
- Runtime persistence.
- API behavior.
- Backup/restore.
- Public contracts.
- Security boundaries.

## UI and End-to-End Tests

UI and end-to-end tests verify critical journeys only:

- Authentication.
- Project creation.
- Manuscript editing.
- Translation.
- Review.
- Publishing.
- Library.
- Distribution.

## Current Balance

The current suite is strong in contract tests. Pure unit and domain tests are
less visible because many business rules are still tested through module-level
contract tests.

## Required Direction

Future refactoring should extract pure domain rules and add unit/domain tests
without duplicating existing contract coverage.
