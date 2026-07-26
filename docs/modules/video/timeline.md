# Video Timeline and Scenes

## Purpose

The timeline is the non-destructive production model that orders scenes,
tracks, media assets, captions, audio, effects, transitions, and timing.

Timeline changes must not modify the underlying Library text, audio source, or
media assets.

## Scene Model

Each scene should include:

- `sceneId`.
- `timelineId`.
- `order`.
- `durationMs`.
- `sourceTextReference`.
- `sourceSegmentIds`.
- `visualAssetRefs`.
- `audioAssetRefs`.
- `captionTrackRefs`.
- `transitionProfile`.
- `effectsProfile`.
- `layoutProfile`.
- `accessibilityNotes`.
- `version`.

## Timeline Tracks

Required track types:

- Video track.
- Image track.
- Audio track.
- Caption track.
- Graphics track.
- Effects track.

Future track types may be added through metadata without changing the core
timeline model.

## Current Repository Baseline

Current support:

- Multimedia Creation has linked asset IDs, subtitle track IDs, and narration
  synchronization metadata.
- Media Localization has timing and synchronization metadata for localized
  media.
- Editorial Pipeline exposes video readiness state and progress.

Current gaps:

- No first-class Timeline aggregate.
- No first-class Scene aggregate.
- No timeline versioning model.
- No multi-track model.
- No scene-level source segment mapping.
- No transition or effect model.
- No selective scene regeneration model.

## Versioning Rules

- Timeline changes create new versions.
- Published timeline versions must remain immutable.
- Scene changes are audited.
- A render job records the timeline version used.
- Corrected timelines supersede older timelines; they do not overwrite them.

## Synchronization Rules

Timeline synchronization must map:

- Text to scene.
- Text to captions.
- Audio to scene.
- Audio to captions.
- Scene to timeline.

Synchronization must preserve segment-level references and timestamps.

## Non-Destructive Editing

The timeline may reference, trim, order, transform, and render assets. It must
not mutate source Library content, original audio files, original images,
approved illustrations, or published video assets.

