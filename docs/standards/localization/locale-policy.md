# Canonical Locale Policy

## Purpose

This policy defines supported interface languages, language separation rules,
fallback behavior, and localized metadata rules for Standard 11.

## Official Language Attributes

The platform distinguishes:

- Platform Language: language used for menus, buttons, labels, dialogs,
  notifications, administration, dashboards, AI conversations, and workspace
  explanations.
- Original Language: language of the original publication.
- Authoring Language: language currently used while editing a manuscript.
- Target Language: language of each translation output.
- Metadata Language: language of localized metadata values.
- Subtitle Language: language of subtitle tracks.
- Audio Language: language of narration or audio tracks.
- Derived Asset Language: language of localized images, video, audio, or
  publication derivatives.

Changing Platform Language must not change editorial content language,
Original Language, Authoring Language, Target Language, subtitle language,
audio language, or derived asset language.

## Supported v1.0 Platform Languages

| Locale family | Required base code | Notes |
| --- | --- | --- |
| Romanian | `ro` | Primary UI language |
| English | `en` | Default fallback family |
| Spanish | `es` | Supported UI family |
| French | `fr` | Supported UI family |
| Portuguese | `pt` | Supported UI family |
| Italian | `it` | Supported UI family |
| German | `de` | Supported UI family |

Implementation may store regional tags such as `ro-RO`, `en-US`, `es-ES`,
`fr-FR`, `pt-PT`, `it-IT`, or `de-DE`, but UI language availability is
governed by the base language set above.

## Fallback Policy

For v1.0:

- User language detection must be controlled.
- Users may change Platform Language.
- The selected Platform Language must be stored in the user profile or
  workspace preference when supported.
- Missing translations must not be hidden.
- Production must not display technical translation keys.
- Temporary fallback to another language must be logged and treated as a
  localization nonconformity.

## Localized Metadata

Localizable metadata may contain multiple language values. The model must
distinguish:

- Canonical value.
- Translation.
- Transliteration.
- Historical variant.
- Alternative name.

Example shape:

```json
{
  "title": {
    "canonical": "title-source-value",
    "translations": {
      "ro": "localized-title-ro",
      "en": "localized-title-en",
      "es": "localized-title-es"
    },
    "transliterations": {},
    "historicalVariants": {},
    "alternativeNames": {}
  }
}
```

## Compliance Rules

- No mixed-language interface is allowed.
- No module may define a separate incompatible language model.
- Web, PWA, tablet, and future mobile applications must share canonical keys.
- New languages must be added through resource configuration and review, not
  through business logic changes.

