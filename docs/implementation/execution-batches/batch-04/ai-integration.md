# Editorial AI Integration

AI may assist with translation, comparison, terminology detection, tense checking, correction proposals,
contradiction detection, and reformulation suggestions.

## Required Execution Metadata

`EditorialAiExecutionRecord` stores:

- `agent_id`
- `model_id`
- `prompt_version`
- `source_version`
- `input_reference`
- `output_reference`
- `cost`
- `timestamp`
- `review_status`
- `direct_approved_version_modification`

## Mandatory Rule

AI must not directly modify an approved document version.

Flow:

```text
AI proposal
Suggestion
Human Review
Accept / Reject
New Document Version
```

Low-risk auto-apply policies may be added later, but final editorial approval cannot be automated.
