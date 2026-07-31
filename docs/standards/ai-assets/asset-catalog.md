# AI Asset Catalog Standard

## Purpose

This document defines the canonical catalog structure for AI assets.

The catalog standard ensures that AI agents, prompts, models, RAG collections,
knowledge bases, evaluation datasets, workflows, and policies are uniquely
identified, versioned, documented, evaluated, governed, and auditable.

## Required Catalog Fields

Every AI asset catalog record must define:

- `uuid`.
- `canonicalName`.
- `displayName`.
- `assetType`.
- `version`.
- `status`.
- `owner`.
- `lifecycleState`.
- `description`.
- `domain`.
- `supportedModules`.
- `dependencies`.
- `metadata`.
- `classification`.
- `createdBy`.
- `createdAt`.
- `updatedBy`.
- `updatedAt`.
- `approvalStatus`.
- `approvedBy`.
- `approvedAt`.
- `auditInformation`.

## Asset Status

Canonical asset statuses:

- `DRAFT`.
- `UNDER_REVIEW`.
- `APPROVED`.
- `ACTIVE`.
- `SUSPENDED`.
- `DEPRECATED`.
- `ARCHIVED`.

Only `ACTIVE` assets may be used as stable production AI assets.

## Asset Classification

AI assets must record:

- Sensitivity.
- Criticality.
- Provenance.
- Intended audience.
- Tenant scope.
- Need-to-Know restrictions.
- Allowed execution contexts.
- Human approval requirement.

Prompt content, model parameters, RAG source material, evaluation datasets, and
policy records may have different classifications. The most restrictive
classification wins.

## Asset Dependencies

Dependencies may include:

- Prompt versions.
- System prompt versions.
- Model versions.
- Provider records.
- Embedding models.
- RAG collections.
- Knowledge bases.
- Evaluation datasets.
- Policy versions.
- Cost policies.
- API contracts.
- Event contracts.
- Workflow states.

Dependencies must be explicit. Production AI behavior must be reproducible
from recorded asset versions.

## Canonical Asset Families

| Family | Required owner |
| --- | --- |
| AI agents | AI Governance and parent functional domain |
| Prompt templates | AI Governance |
| System prompts | AI Governance |
| AI models | AI Governance |
| Embedding models | AI Governance |
| RAG collections | AI Governance and source data owner |
| Knowledge bases | Owning domain and AI Governance |
| Evaluation datasets | AI Governance and Quality Governance |
| AI workflows | AI Orchestration |
| AI policies | Policy Engine and AI Governance |

## Evaluation Metadata

AI asset catalog records must link to evaluation evidence when applicable:

- Accuracy.
- Precision.
- Recall.
- Hallucination rate.
- Response consistency.
- Latency.
- Cost.
- Safety score.
- Human review score.
- Evaluation dataset version.
- Evaluated prompt version.
- Evaluated model version.
- Evaluation date.

## Audit

Audit must record:

- Asset created.
- Asset updated.
- Asset approved.
- Asset activated.
- Asset suspended.
- Asset deprecated.
- Asset archived.
- Dependency changed.
- Classification changed.
- Exception approved.

## Current Baseline

Current AI asset metadata is distributed across AI Governance, AI
Orchestration, Marketplace, Observability, Policy, and module-level
documentation. Standard 04 is the canonical owner for the AI asset model. The
existing documents remain local registries, catalogs, and implementation
guidance.

