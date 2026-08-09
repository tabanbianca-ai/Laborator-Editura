# Risk Burn-Down

Status: Initial RC1 risk register created  
Owner: Release Management

## Risk States

- CLOSED;
- MITIGATED;
- ACCEPTED;
- TRANSFERRED;
- OPEN.

## Open Risks

| ID | Severity | Risk | State | Mitigation | RC1 Impact |
| --- | --- | --- | --- | --- | --- |
| RISK-RC1-001 | CRITICAL | Restore has not been proven from real staging backup. | OPEN | Execute restore validation. | BLOCKS_RC1 |
| RISK-RC1-002 | CRITICAL | RC1 artifact digest, SBOM, and provenance are missing. | OPEN | Generate release artifact evidence. | BLOCKS_RC1 |
| RISK-RC1-003 | HIGH | Live cross-organization adversarial suite has not been recorded. | OPEN | Run staging security suite. | BLOCKS_RC1 until pass or accepted |
| RISK-RC1-004 | HIGH | Performance baseline has not been measured on staging. | OPEN | Run staging baseline. | BLOCKS_RC1 until pass or accepted |
| RISK-RC1-005 | HIGH | Accessibility E2E review has not been recorded on staging. | OPEN | Run accessibility validation. | BLOCKS_RC1 until pass or accepted |

## Rule

Critical open risks block RC1.

