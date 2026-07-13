export interface LanguageLocaleMetadata {
  language: string;
  locale?: string;
}

export type OfficialLanguageAttribute =
  | "platformLanguage"
  | "originalLanguage"
  | "authoringLanguage"
  | "targetLanguage";

export type LanguageResourceKind =
  | "DICTIONARY"
  | "GLOSSARY"
  | "TERMINOLOGY"
  | "PHRASEOLOGY"
  | "LINGUISTIC_RESOURCE";

export interface TargetLanguageConfiguration extends LanguageLocaleMetadata {
  enabled: boolean;
}

export interface ProjectLanguageConfiguration {
  originalLanguage: string;
  originalLocale?: string;
  authoringLanguage: string;
  authoringLocale?: string;
  targetLanguages: TargetLanguageConfiguration[];
  originalLanguageImmutable: true;
  multilingualAuthoringSupported: true;
  multipleTargetLanguagesSupported: true;
}

export interface ParallelReviewLanguageColumn extends LanguageLocaleMetadata {
  columnId: string;
  label: "Original" | "Translation" | "Comparison";
  versionId?: string;
}

export interface LinguisticResourceLoadingPlan {
  sourceLanguage: string;
  sourceLocale?: string;
  targetLanguage: string;
  targetLocale?: string;
  resources: Record<LanguageResourceKind, {
    enabled: true;
    authoritative: false;
    loadedByLanguagePair: true;
  }>;
}

export interface UnifiedLanguageManagementModel {
  platformLanguage: string;
  platformLocale?: string;
  defaultPlatformLanguage: string;
  fallbackLanguage: string;
  installedLanguages: string[];
  enabledLanguages: string[];
  translationCompleteness: Record<string, number>;
  project: ProjectLanguageConfiguration;
  linguisticResourceLoading: LinguisticResourceLoadingPlan[];
  uiLocalizedByPlatformLanguage: true;
  aiAgentsUsePlatformLanguage: true;
  translationUsesOriginalToTarget: true;
  noMixedLanguageInterface: true;
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

export const OFFICIAL_LANGUAGE_ATTRIBUTES = [
  "platformLanguage",
  "originalLanguage",
  "authoringLanguage",
  "targetLanguage"
] as const satisfies readonly OfficialLanguageAttribute[];

export const SUPPORTED_PLATFORM_LANGUAGES = [
  {
    label: "Romanian",
    language: "ro",
    locale: "ro-RO"
  },
  {
    label: "English",
    language: "en",
    locale: "en-US"
  },
  {
    label: "British English",
    language: "en",
    locale: "en-GB"
  }
] as const;

export const PARALLEL_REVIEW_LANGUAGE_POLICY = {
  defaultColumns: 2,
  supportsThreeColumns: true,
  supportsFourColumns: true,
  eachColumnSelectsLanguageAndVersion: true
} as const;

const LANGUAGE_TAG_PATTERN = /^[A-Za-z]{2,3}(?:-[A-Za-z0-9]{2,8})*$/;

const LANGUAGE_DISPLAY_NAMES: Record<string, string> = {
  de: "German",
  en: "English",
  es: "Spanish",
  fr: "French",
  it: "Italian",
  pt: "Portuguese",
  ro: "Romanian"
};

export function normalizeLanguageLocale(
  languageOrLocale: string,
  explicitLocale?: string
): LanguageLocaleMetadata {
  const normalizedLanguageTag = normalizeLanguageTag(languageOrLocale);
  const [language = ""] = normalizedLanguageTag.split("-");
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

  const supportedLocales: readonly string[] = policy.locales;

  if (normalized.locale && !supportedLocales.includes(normalized.locale)) {
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

export function resolvePlatformLanguage(platformLanguage?: string): LanguageLocaleMetadata {
  const fallback = SUPPORTED_PLATFORM_LANGUAGES[0];

  if (!platformLanguage || !isIsoCompatibleLanguageTag(platformLanguage)) {
    return {
      language: fallback.language,
      locale: fallback.locale
    };
  }

  const normalized = normalizeLanguageLocale(platformLanguage);
  const supported = SUPPORTED_PLATFORM_LANGUAGES.find((language) => {
    return language.locale === normalized.locale || language.language === normalized.language;
  });

  return {
    language: supported?.language ?? normalized.language,
    locale: normalized.locale ?? supported?.locale
  };
}

export function createProjectLanguageConfiguration(input: {
  originalLanguage: string;
  originalLocale?: string;
  authoringLanguage?: string;
  authoringLocale?: string;
  targetLanguages?: Array<{
    language: string;
    locale?: string;
    enabled?: boolean;
  }>;
}): ProjectLanguageConfiguration {
  const original = normalizeLanguageLocale(input.originalLanguage, input.originalLocale);
  const authoring = normalizeLanguageLocale(
    input.authoringLanguage ?? input.originalLanguage,
    input.authoringLocale
  );

  return {
    originalLanguage: original.language,
    originalLocale: original.locale,
    authoringLanguage: authoring.language,
    authoringLocale: authoring.locale,
    targetLanguages: (input.targetLanguages ?? []).map((target) => {
      const normalizedTarget = normalizeLanguageLocale(target.language, target.locale);

      return {
        language: normalizedTarget.language,
        locale: normalizedTarget.locale,
        enabled: target.enabled ?? true
      };
    }),
    originalLanguageImmutable: true,
    multilingualAuthoringSupported: true,
    multipleTargetLanguagesSupported: true
  };
}

export function createParallelReviewColumns(input: {
  originalLanguage: string;
  originalLocale?: string;
  targetLanguage: string;
  targetLocale?: string;
  comparisonLanguages?: Array<LanguageLocaleMetadata & { versionId?: string }>;
}): ParallelReviewLanguageColumn[] {
  const original = normalizeLanguageLocale(input.originalLanguage, input.originalLocale);
  const target = normalizeLanguageLocale(input.targetLanguage, input.targetLocale);
  const comparisonColumns = (input.comparisonLanguages ?? []).slice(0, 2).map((comparison, index) => {
    const normalized = normalizeLanguageLocale(comparison.language, comparison.locale);

    return {
      columnId: `comparison-${index + 1}`,
      label: "Comparison" as const,
      language: normalized.language,
      locale: normalized.locale,
      versionId: comparison.versionId
    };
  });

  return [
    {
      columnId: "original",
      label: "Original",
      language: original.language,
      locale: original.locale
    },
    {
      columnId: "translation",
      label: "Translation",
      language: target.language,
      locale: target.locale
    },
    ...comparisonColumns
  ];
}

export function createLinguisticResourceLoadingPlan(input: {
  sourceLanguage: string;
  sourceLocale?: string;
  targetLanguage: string;
  targetLocale?: string;
}): LinguisticResourceLoadingPlan {
  const source = normalizeLanguageLocale(input.sourceLanguage, input.sourceLocale);
  const target = normalizeLanguageLocale(input.targetLanguage, input.targetLocale);
  const resourceState = {
    enabled: true,
    authoritative: false,
    loadedByLanguagePair: true
  } as const;

  return {
    sourceLanguage: source.language,
    sourceLocale: source.locale,
    targetLanguage: target.language,
    targetLocale: target.locale,
    resources: {
      DICTIONARY: resourceState,
      GLOSSARY: resourceState,
      TERMINOLOGY: resourceState,
      PHRASEOLOGY: resourceState,
      LINGUISTIC_RESOURCE: resourceState
    }
  };
}

export function createUnifiedLanguageManagementModel(input: {
  platformLanguage?: string;
  originalLanguage: string;
  originalLocale?: string;
  authoringLanguage?: string;
  authoringLocale?: string;
  targetLanguages?: Array<{
    language: string;
    locale?: string;
    enabled?: boolean;
  }>;
  fallbackLanguage?: string;
  translationCompleteness?: Record<string, number>;
}): UnifiedLanguageManagementModel {
  const platform = resolvePlatformLanguage(input.platformLanguage);
  const project = createProjectLanguageConfiguration(input);
  const enabledTargets = project.targetLanguages.filter((target) => target.enabled);

  return {
    platformLanguage: platform.language,
    platformLocale: platform.locale,
    defaultPlatformLanguage: "ro-RO",
    fallbackLanguage: input.fallbackLanguage ?? "en-US",
    installedLanguages: SUPPORTED_PLATFORM_LANGUAGES.map((language) => language.locale),
    enabledLanguages: SUPPORTED_PLATFORM_LANGUAGES.map((language) => language.locale),
    translationCompleteness: input.translationCompleteness ?? {
      "en-US": 100,
      "en-GB": 100,
      "ro-RO": 100
    },
    project,
    linguisticResourceLoading: enabledTargets.map((target) =>
      createLinguisticResourceLoadingPlan({
        sourceLanguage: project.originalLanguage,
        sourceLocale: project.originalLocale,
        targetLanguage: target.language,
        targetLocale: target.locale
      })
    ),
    uiLocalizedByPlatformLanguage: true,
    aiAgentsUsePlatformLanguage: true,
    translationUsesOriginalToTarget: true,
    noMixedLanguageInterface: true
  };
}

export function languagePolicySummaryV1(): string {
  return SUPPORTED_TRANSLATION_TARGETS_V1.map((target) => {
    const locales = target.locales.length > 0 ? ` (${target.locales.join(", ")})` : "";

    return `${target.label}: ${target.language}${locales}`;
  }).join("; ");
}

export function formatLanguageLocale(language: string, locale?: string): string {
  const normalized = normalizeLanguageLocale(language, locale);
  const label = LANGUAGE_DISPLAY_NAMES[normalized.language] ?? normalized.language.toUpperCase();

  return normalized.locale ? `${label} (${normalized.locale})` : label;
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

      const firstCharacter = part[0] ?? "";

      return `${firstCharacter.toUpperCase()}${part.slice(1).toLowerCase()}`;
    })
    .join("-");
}

function inferLocale(languageTag: string): string | undefined {
  return languageTag.includes("-") ? languageTag : undefined;
}
