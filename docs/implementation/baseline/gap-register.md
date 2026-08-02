# Gap Register

Status: Batch 01 baseline

| ID | Gap | Priority | Batch 01 handling |
| --- | --- | --- | --- |
| GAP-001 | Required baseline and backlog deliverables were absent. | P0 | Create required documents. |
| GAP-002 | Secret scan printed matching lines, which could expose sensitive values in logs. | P0 | Harden scan output to report file paths only. |
| GAP-003 | Root command set lacked non-mutating format check and single canonical local verification command. | P0 | Add commands. |
| GAP-004 | Shared canonical configuration validator was absent. | P1 | Add typed shared helper and tests. |
| GAP-005 | Shared canonical error model was absent. | P1 | Add typed shared helper and tests. |
| GAP-006 | Shared structured logging helper was absent. | P1 | Add typed shared helper and tests. |
| GAP-007 | Locale resource files for seven official UI languages were absent. | P1 | Add common baseline files and tests. |
| GAP-008 | Health endpoints were limited to `/health`. | P1 | Add liveness/readiness/startup endpoints without sensitive data. |
| GAP-009 | Ownership registry existed conceptually but not as Batch 01 implementation artifact. | P1 | Create ownership register. |

