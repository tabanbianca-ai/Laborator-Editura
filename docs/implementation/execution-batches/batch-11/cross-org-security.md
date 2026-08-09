# Cross-Organization Security

Status: Repository isolation tests passed; live IDOR suite pending  
Owner: Security Governance

## Required Cross-Org Targets

- projects;
- master documents;
- library;
- translations;
- rights;
- publications;
- assets;
- search;
- RAG;
- audio/video;
- reader data;
- orders;
- downloads;
- audit.

## Current Evidence

Tenant isolation is covered across Auth, DB runtime, foundation persistence, observability, backup governance, public portal, commerce, library, need-to-know, security governance, policy, workspace, AI governance, and module contract tests.

## RC1 Gate

Any confirmed unauthorized cross-organization access is an RC1 blocker.

## Remaining Work

Run a live staging IDOR/cross-organization suite with two organizations and record pass/fail evidence.

