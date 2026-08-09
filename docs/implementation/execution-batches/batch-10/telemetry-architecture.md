# Telemetry Architecture

Status: Canonical telemetry contract established  
Owner: Platform Operations

## Telemetry Flow

Public request -> Web -> API -> Workflow/Module service -> Repository/Database -> AI Orchestrator where used -> Publishing/Export where used -> External provider where configured.

## Required Context

Every telemetry event must preserve:

- environment;
- service;
- module;
- correlation id;
- trace id;
- span id;
- actor id when authenticated;
- organization id when tenant scoped;
- resource id when available.

## Sensitive Data Rule

Telemetry must never log secrets, tokens, cookies, passwords, raw editorial documents, raw prompts, full media payloads, payment data, or private voice samples.

## Current Implementation

- Shared structured log event contract exists in `packages/shared/src/structured-logging.ts`.
- The contract includes redaction and the canonical Batch 10 fields.
- External APM is not connected in this batch.

## RC1 Gate

Before RC1, staging validation must prove that request correlation can be followed from the web/API entry point to backend processing logs for critical journeys.

