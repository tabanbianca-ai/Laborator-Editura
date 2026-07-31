# Security Monitoring

## Purpose

Security Monitoring tracks authentication, authorization, privileged access,
configuration changes, API traffic, AI events, critical events, anomalies,
threat signals, and security control health.

## Monitoring Targets

Security monitoring must track:

- Login success and failure.
- Account lockout.
- Password reset.
- Session creation, refresh, expiration, and revocation.
- MFA events where implemented.
- Authorization failures.
- Restricted access attempts.
- Privileged access.
- Role and permission changes.
- API key creation, use, and revocation.
- Webhook and integration secret events.
- Configuration changes.
- Security policy changes.
- API traffic anomalies.
- AI execution events.
- AI provider fallback and policy blocks.
- Secret scan findings.
- Vulnerability findings.
- Backup and restore security events.
- Infrastructure hardening status.

## Required Telemetry

Security telemetry should preserve:

- Event id.
- Event type.
- Actor.
- Organization.
- Resource.
- Severity.
- IP or network metadata where safe and allowed.
- User agent where safe and allowed.
- Correlation id.
- Session id where applicable.
- Result.
- Timestamp.
- Safe metadata.

Telemetry must not expose secrets or restricted content.

## Threat Detection

Threat detection should identify:

- Brute force attempts.
- Suspicious session activity.
- Privilege escalation attempts.
- Tenant boundary violations.
- API abuse.
- Secret exposure.
- Integration failures.
- Unexpected AI data access.
- Policy bypass attempts.
- Configuration drift.

## Current Baseline

Current foundations:

- Auth activity events.
- Auth security events.
- Security Governance session events and policy violations.
- Observability logs, metrics, traces, and audit events.
- Gateway API key and webhook audit events.
- Infrastructure monitoring scripts.
- Security validation scripts.

## SIEM Integration

SIEM integration is a target capability.

When implemented, it should receive:

- Security events.
- Authentication events.
- Authorization events.
- Audit events.
- Infrastructure security events.
- Integration security events.
- AI security events.
- Vulnerability findings.

## Current Gaps

- SIEM integration is not implemented.
- Security alerts are not centralized in an alert manager.
- Threat detection rules are not fully formalized.
- Security dashboards are metadata foundations rather than full operations
  dashboards.

## Standardization Plan

1. Map security events to observability records.
2. Define alert rules for critical security events.
3. Add threat detection rule catalog.
4. Add SIEM export contract.
5. Add dashboard and reporting in future approved phases.
