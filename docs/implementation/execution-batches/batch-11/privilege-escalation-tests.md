# Privilege Escalation Tests

Status: Repository authorization tests passed; live adversarial suite pending  
Owner: Security Governance

## Required Negative Tests

- READER to Editor.
- Editor to Administrator.
- Project role to platform role.
- Service account to human role.
- AI Agent to privileged tool.
- Expired role.
- Revoked role.
- Manipulated organization id.
- Manipulated resource UUID.

## Expected Result

Default: DENY.

## Current Evidence

Auth, RBAC, founder protection, security governance, need-to-know, AI governance, gateway, and module contract tests preserve server-derived identity and deny client-provided authority.

## RC1 Gate

Privilege escalation evidence must pass on the RC1 staging candidate.

