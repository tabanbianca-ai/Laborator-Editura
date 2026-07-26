# Video Media Assets

## Purpose

Video Media Assets define how images, illustrations, photos, animations,
audio, music, sound effects, captions, logos, and graphics are referenced by
video projects.

The Video module must reuse centrally governed assets rather than duplicating
files across projects.

## Asset Sources

Allowed sources:

- Library assets.
- Multimedia Creation assets.
- Media Localization assets.
- Audio assets.
- Publishing assets.
- Rights-approved external references.

All assets must preserve source references and rights metadata.

## Asset Types

Supported video asset references:

- `IMAGE`.
- `ILLUSTRATION`.
- `PHOTO`.
- `ANIMATION`.
- `VIDEO`.
- `AUDIO`.
- `MUSIC`.
- `SOUND_EFFECT`.
- `SUBTITLE`.
- `CAPTION`.
- `LOGO`.
- `GRAPHIC`.

## Current Repository Baseline

Current support:

- `MultimediaAsset` supports image, audio, video, and subtitle assets.
- `MediaLocalizationAsset` supports localized images, subtitle tracks, voice
  tracks, dubbing tracks, localized videos, and localized audio.
- Assets contain source references, rights metadata, version history, and
  audit support.
- Library can preserve publication and asset metadata.

Current gaps:

- No video-specific asset usage model.
- No scene-level asset placement model.
- No asset rights preflight per timeline.
- No music or sound-effect-specific governance model.
- No platform-specific thumbnail/cover asset model.

## Asset Reference Record

Each video asset reference should include:

- `assetRefId`.
- `videoProjectId`.
- `sceneId`.
- `libraryAssetId`.
- `multimediaAssetId`.
- `mediaLocalizationAssetId`.
- `assetType`.
- `usageType`.
- `rightsRecordId`.
- `sourceReference`.
- `version`.

Usage types:

- `BACKGROUND`.
- `FOREGROUND`.
- `NARRATION`.
- `MUSIC`.
- `SOUND_EFFECT`.
- `CAPTION`.
- `THUMBNAIL`.
- `LOGO`.
- `REFERENCE_ONLY`.

## Rights Rules

Before official rendering or publication, Video must verify rights for:

- Source text.
- Images.
- Illustrations.
- Photos.
- Audio.
- Music.
- Sound effects.
- Voice-over.
- Captions and localized content.
- Logos and brand assets.

Rights validation is performed by Rights and Provenance, not by Video.

