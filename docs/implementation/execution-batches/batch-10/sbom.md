# SBOM

Status: SBOM requirement defined; generated SBOM pending  
Owner: DevSecOps

## Required SBOM Scope

- root workspace dependencies;
- API package dependencies;
- web package dependencies;
- shared package dependencies;
- DB package dependencies;
- AI package dependencies;
- container base images when available.

## Required Format

CycloneDX or SPDX is acceptable for RC1. The generated file must be stored as CI artifact or release evidence and must reference the exact commit and build digest.

## Current Status

No generated SBOM artifact is committed in this batch. This is an RC1 evidence item, not application behavior.

