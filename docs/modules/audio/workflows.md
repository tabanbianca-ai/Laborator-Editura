# Audio and Narration Workflows

## Purpose

This document defines official workflows for narration projects, TTS
generation, human recording, synchronization, review, and publication handoff.

## Narration Project Workflow

```text
Narration Project Created
  -> Voice Selection
  -> Audio Generation or Human Recording
  -> Quality Review
  -> Synchronization
  -> Approved
  -> Ready for Publishing
  -> Publishing Handoff
```

## TTS Workflow

```text
Source Text Version Selected
  -> Text Normalization
  -> Pronunciation Resolution
  -> SSML Generation
  -> Voice Profile Selection
  -> AI Orchestration Task
  -> Audio Asset Created
  -> Validation
  -> Synchronization
```

## Human Recording Workflow

```text
Narrator Assigned
  -> Recording Imported
  -> Rights and Consent Checked
  -> Audio Asset Created
  -> Quality Review
  -> Synchronization
```

## Preview Audio Workflow

```text
Draft Text
  -> Voice Selection
  -> Preview Generation
  -> Draft Audio Asset
  -> Playback Preview
```

Preview audio must never be published.

## Official Audiobook Workflow

```text
Approved Text
  -> Rights Validation
  -> Voice Rights Validation
  -> Official Generation or Recording
  -> Audio Review
  -> Synchronization
  -> Publishing Handoff
```

Official audio requires approved text, valid voice rights, publication rights,
and workflow approval.

## Voice Cloning Workflow

```text
Voice Consent Recorded
  -> Voice Samples Linked
  -> Rights Validation
  -> Voice Model Created through AI Orchestration
  -> Voice Profile Version Created
  -> Human Review
```

AI must not clone, publish, or reuse voices without documented consent and
rights validation.

## Current Workflow Baseline

The current frontend Editorial Pipeline already models preview audio and
official audiobook gating. Backend multimedia modules support audio project
metadata and media assets, but no dedicated audio workflow runtime exists.

## Blocking Rules

Audio publication must be blocked when:

- Source text is not approved.
- Publishing rights are missing.
- Voice rights are missing.
- Voice consent is expired or invalid.
- Audio review is incomplete.
- Synchronization is missing or rejected.
- Publishing workflow gates are not satisfied.

