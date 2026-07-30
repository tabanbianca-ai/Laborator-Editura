# DevSecOps Source Control

## Purpose

Source Control defines how Laborator Editura manages repositories, branches,
pull requests, reviews, merge policy, commit traceability, and semantic
versioning.

## Source Control Rules

- Git is the authoritative source control system.
- `main` must contain stable versions only in controlled environments.
- Changes should enter controlled branches through pull requests.
- Pull requests must pass required validation before merge.
- Force-pushing protected branches is not allowed in controlled environments.
- Releases must be traceable to source commits.
- Manual production changes outside source control are prohibited.

## Branch Strategy

Target branch model:

- `main` for stable controlled versions.
- Short-lived feature branches for bounded work.
- Release tags for approved release candidates.
- Hotfix branches only for urgent release repair.

Branch protection is a repository setting and must be configured in the
hosting platform in addition to documentation.

## Pull Request Policy

Pull requests should require:

- Automated CI status.
- Code review where applicable.
- Secret scan.
- Typecheck where dependencies are available.
- Tests.
- Build.
- Infrastructure syntax validation where touched.
- Clear scope and release notes when relevant.

## Current Repository Baseline

Current source control foundations:

- The repository uses Git.
- GitHub Actions workflows validate push and pull request events.
- Staging deployment can deploy a selected ref.
- Staging operations can rollback to a specified ref with confirmation.
- Chapter 13 documentation defines stable `main`, PR validation, and
  controlled deployment principles.

Current gaps:

- Branch protection cannot be verified fully from repository files.
- Semantic versioning automation is not yet implemented.
- Release tag workflow is not yet formalized.
- Artifact signing and provenance are not yet configured.

## Semantic Versioning

Future releases should follow semantic versioning:

- `MAJOR` for incompatible production changes.
- `MINOR` for backward-compatible capability additions.
- `PATCH` for fixes and operational corrections.

Each release must reference:

- Git commit.
- Build number.
- Artifact checksum.
- Deployment target.
- Rollback target.

## Audit Events

Audit:

- Commit associated with release.
- Pull request approved.
- Branch policy changed.
- Merge policy changed.
- Release tag created.
- Hotfix branch created.
