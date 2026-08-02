# Platform Deprecation Policy

## Purpose

This document defines the canonical policy for deprecating platform
components.

## Deprecation Record

Every deprecation must include:

- Deprecation ID.
- Component ID.
- Component name.
- Component type.
- Current version.
- Reason.
- Impact.
- Alternative.
- Migration plan.
- Removal deadline.
- Support level during deprecation.
- Affected dependencies.
- Documentation updates.
- Communication plan.
- Approval.
- Audit information.

## Deprecation Rules

- Deprecation must be announced before retirement.
- Deprecated components must not be silently removed.
- Dependencies must be mapped before deprecation.
- Alternatives must be documented.
- Migration plans must be available for dependent components.
- Security-critical deprecations may use accelerated timelines, but still
  require approval and audit.
- AI may identify candidates for deprecation and summarize impact, but must
  not approve deprecation or remove components.

## Current Baseline

The repository contains an existing operations deprecation policy at:

- `docs/operations/deprecation-policy.md`.

This Standard 19 policy is the canonical owner for platform-wide deprecation
rules. The operations document may retain environment-specific procedures.

