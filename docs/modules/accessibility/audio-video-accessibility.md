# Audio and Video Accessibility

## Purpose

Audio and Video Accessibility ensures audio, audiobook, video, localized media,
and multimedia publication outputs support transcripts, captions, subtitles,
audio descriptions, language metadata, and synchronized navigation.

## Covered Media

The module covers:

- Audiobooks.
- Audio chapters.
- Narration previews.
- Official narration outputs.
- Video previews.
- Official video outputs.
- Magazine article audio.
- Magazine article video.
- Localized media.
- Captions.
- Subtitles.
- Transcripts.
- Audio descriptions.

## Current Repository Baseline

Current strengths:

- Media Localization models subtitle tracks, voice tracks, dubbing tracks,
  localized videos, localized audio, timing metadata, caption styles, and QA
  evidence.
- Multimedia Creation models audio projects, video projects, media assets,
  subtitle tracks, voice profiles, and version history.
- Audio and Video module documentation covers narration, synchronization,
  timelines, rendering, captions, and media assets.
- Editorial Pipeline UI includes preview audio, official audiobook, preview
  video, official video, subtitle language/locale, and draft-only gating.
- Public Portal and Library metadata can reference audio chapters, video
  references, and localized media references.

Current gaps:

- No centralized Caption Service exists.
- No centralized Transcript Service exists.
- No centralized Audio Description Service exists.
- No automatic subtitle/transcript generation provider is connected.
- No accessibility validation engine exists for media outputs.
- Sign language support remains optional future metadata.

## Caption and Subtitle Requirements

Caption tracks must preserve:

- Language.
- Locale.
- Timestamp metadata.
- Caption type.
- Format.
- Version.
- Source media reference.
- Approval status.

Supported formats:

- WebVTT.
- SRT.
- ASS.

## Transcript Requirements

Transcripts must preserve:

- Language and locale.
- Speaker metadata where available.
- Timecodes.
- Segment alignment.
- Source media reference.
- Source manuscript or publication reference.
- Version.
- Validation status.

## Audio Description Requirements

Audio description metadata should preserve:

- Timing.
- Description text.
- Language.
- Narrator or voice metadata.
- Source visual reference.
- Approval status.

## Rules

- Preview audio and preview video are draft-only and must never be published.
- Official audiobook and official video require final approval and rights.
- Accessibility metadata must remain linked to the original media and each
  localized media version.
- AI may generate draft captions, transcripts, descriptions, and timing
  suggestions, but authorized humans retain final approval.
