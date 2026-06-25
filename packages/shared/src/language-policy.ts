export interface LanguageLocaleMetadata {
  language: string;
  locale?: string;
}

export interface TranslationTargetPolicy {
  label: string;
  language: string;
  localeRequired: boolean;
  locales: readonly string[];
}

export interface TranslationTargetValidationResult extends LanguageLocaleMetadata {
  valid: boolean;
  reason?: string;
}

export const SUPPORTED_TRANSLATION_TARGETS_V1 = [
  {
    label: "Romanian",
    language: "ro",
    localeRequired: false,
    locales: ["ro-RO"]
  },
  {
    label: "English",
    language: "en",
    localeRequired: true,
    locales: ["en-US", "en-GB", "en-CA", "en-AU"]
  },
  {
    label: "French",
    language: "fr",
    localeRequired: true,
    locales: ["fr-FR", "fr-CA"]
  },
  {
    label: "Spanish",
    language: "es",
    localeRequired: true,
    locales: ["es-ES", "es-MX", "es-AR"]
  },
  {
    label: "Italian",
    language: "it",
    localeRequired: true,
    locales: ["it-IT"]
  },
  {
    label: "Portuguese",
    language: "pt",
    localeRequired: true,
    locales: ["pt-PT", "pt-BR"]
  },
  {
    label: "German",
    language: "de",
    localeRequired: true,
    locales: ["de-DE", "de-AT", "de-CH"]
  }
] as const satisfies readonly TranslationTargetPolicy[];

const LANGUAGE_TAG_PATTERN = /^[A-Za-z]{2,3}(?:-[A-Za-z0-9]{2,8})*$/;

export function normalizeLanguageLocale(
  languageOrLocale: string,
  explicitLocale?: string
): LanguageLocaleMetadata {
  const normalizedLanguageTag = normalizeLanguageTag(languageOrLocale);
  const language = normalizedLanguageTag.split("-")[0];
  const locale = explicitLocale ? normalizeLanguageTag(explicitLocale) : inferLocale(normalizedLanguageTag);

  return {
    language,
    locale
  };
}

export function isIsoCompatibleLanguageTag(value: string): boolean {
  return LANGUAGE_TAG_PATTERN.test(value.trim());
}

export function validateIsoCompatibleLanguageTag(value: string): TranslationTargetValidationResult {
  if (!value || !isIsoCompatibleLanguageTag(value)) {
    return {
      language: "",
      valid: false,
      reason: "Language must be ISO-compatible."
    };
  }

  return {
    ...normalizeLanguageLocale(value),
    valid: true
  };
}

export function validateTranslationTargetV1(input: {
  targetLanguage: string;
  targetLocale?: string;
}): TranslationTargetValidationResult {
  if (!input.targetLanguage || !isIsoCompatibleLanguageTag(input.targetLanguage)) {
    return {
      language: "",
      valid: false,
      reason: "Target language must be ISO-compatible."
    };
  }

  const normalized = normalizeLanguageLocale(input.targetLanguage, input.targetLocale);
  const policy = SUPPORTED_TRANSLATION_TARGETS_V1.find(
    (target) => target.language === normalized.language
  );

  if (!policy) {
    return {
      ...normalized,
      valid: false,
      reason: "Target language is not supported for assisted translation v1.0."
    };
  }

  if (normalized.locale && !policy.locales.includes(normalized.locale)) {
    return {
      ...normalized,
      valid: false,
      reason: "Target locale is not supported for assisted translation v1.0."
    };
  }

  if (policy.localeRequired && !normalized.locale) {
    return {
      ...normalized,
      valid: false,
      reason: "Target locale is required for this assisted translation language in v1.0."
    };
  }

  return {
    ...normalized,
    valid: true
  };
}

export function isSupportedTranslationTargetV1(input: {
  targetLanguage: string;
  targetLocale?: string;
}): boolean {
  return validateTranslationTargetV1(input).valid;
}

export function languagePolicySummaryV1(): string {
  return SUPPORTED_TRANSLATION_TARGETS_V1.map((target) => {
    const locales = target.locales.length > 0 ? ` (${target.locales.join(", ")})` : "";

    return `${target.label}: ${target.language}${locales}`;
  }).join("; ");
}

function normalizeLanguageTag(value: string): string {
  const parts = value.trim().replaceAll("_", "-").split("-").filter(Boolean);

  if (parts.length === 0) {
    return "";
  }

  return parts
    .map((part, index) => {
      if (index === 0) {
        return part.toLowerCase();
      }

      if (part.length === 2 || part.length === 3) {
        return part.toUpperCase();
      }

      return `${part[0].toUpperCase()}${part.slice(1).toLowerCase()}`;
    })
    .join("-");
}

function inferLocale(languageTag: string): string | undefined {
  return languageTag.includes("-") ? languageTag : undefined;
}
