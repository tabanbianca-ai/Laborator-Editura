# Editorial Workflow

The canonical Batch 04 workflow is represented by `EDITORIAL_WORKFLOW_STAGES`.

## Minimum Flow

```text
Draft
Translation
Translation Review
Correction
Editorial Review
Final Validation
Approved
```

Not all projects must use this exact flow. Workflow Engine remains configurable.

## Approval Gates

Canonical approval types:

- `TranslationApproved`
- `CorrectionApproved`
- `EditorialReviewApproved`
- `MasterVersionApproved`

Approval fields:

- `approval_id`
- `resource_id`
- `resource_version`
- `approval_type`
- `approved_by`
- `approved_at`
- `decision`
- `comments`

## Rules

- Approval is explicit and version-specific.
- Approval of one version does not approve later versions.
- Workflow gates must not bypass rights, terminology, QA, semantic fidelity, or human approval.
