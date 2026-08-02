# Canonical Risk Management Standard

## Purpose

Risk management identifies, assesses, mitigates, monitors, and audits risks
that may affect strategy, operations, technology, security, privacy, legality,
editorial quality, AI, finance, reputation, continuity, or users.

## Required Risk Fields

Each risk must contain:

- `riskId`.
- `category`.
- `description`.
- `probability`.
- `impact`.
- `riskLevel`.
- `affectedAssets`.
- `mitigationPlan`.
- `contingencyPlan`.
- `owner`.
- `status`.
- `reviewDate`.
- `evidence`.

## Risk Categories

Canonical risk categories are:

- `STRATEGIC`.
- `OPERATIONAL`.
- `TECHNICAL`.
- `SECURITY`.
- `PRIVACY`.
- `LEGAL`.
- `EDITORIAL`.
- `AI`.
- `FINANCIAL`.
- `REPUTATIONAL`.

## Risk Levels

Allowed risk levels are:

- `LOW`.
- `MEDIUM`.
- `HIGH`.
- `CRITICAL`.

## Risk Statuses

Allowed risk statuses are:

- `IDENTIFIED`.
- `ASSESSED`.
- `MITIGATION_PLANNED`.
- `MITIGATING`.
- `ACCEPTED`.
- `TRANSFERRED`.
- `MITIGATED`.
- `CLOSED`.

## Risk Rules

- Every risk must have an owner.
- High and Critical risks require mitigation and contingency plans.
- Accepted risk requires authorized approval and review date.
- Critical risks must be visible in governance reporting.
- Risk evidence must be preserved.
- AI may identify, summarize, and compare risks but must not accept or close
  risks.

