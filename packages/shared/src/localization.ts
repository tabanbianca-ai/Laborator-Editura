export type PlatformLanguage = "ro" | "en" | "es" | "fr" | "pt" | "it" | "de";

export type PlatformLocale =
  | "ro-RO"
  | "en-US"
  | "en-GB"
  | "es-ES"
  | "fr-FR"
  | "pt-PT"
  | "pt-BR"
  | "it-IT"
  | "de-DE";

export type LocalizationMessages = {
  readonly [key: string]: string;
};

export type LocalizationCatalog = {
  readonly [locale in PlatformLocale]?: LocalizationMessages;
};

export interface TranslationLookupResult {
  readonly locale: PlatformLocale;
  readonly fallbackLocale?: PlatformLocale;
  readonly key: string;
  readonly value: string;
  readonly missing: boolean;
}

export interface LocalizationValidationIssue {
  readonly locale: PlatformLocale;
  readonly key: string;
  readonly code: "MISSING_LOCALIZATION_KEY" | "EMPTY_LOCALIZATION_VALUE";
}

export const SUPPORTED_UI_LANGUAGES: readonly PlatformLanguage[] = [
  "ro",
  "en",
  "es",
  "fr",
  "pt",
  "it",
  "de"
];

export const SUPPORTED_UI_LOCALES: readonly PlatformLocale[] = [
  "ro-RO",
  "en-US",
  "en-GB",
  "es-ES",
  "fr-FR",
  "pt-PT",
  "pt-BR",
  "it-IT",
  "de-DE"
];

export const PRIMARY_UI_LOCALE: PlatformLocale = "ro-RO";
export const FALLBACK_UI_LOCALE: PlatformLocale = "en-US";

export function resolvePlatformLocale(value: string | undefined): PlatformLocale {
  if (isPlatformLocale(value)) {
    return value;
  }

  if (value === "ro") {
    return "ro-RO";
  }
  if (value === "en") {
    return "en-US";
  }
  if (value === "es") {
    return "es-ES";
  }
  if (value === "fr") {
    return "fr-FR";
  }
  if (value === "pt") {
    return "pt-PT";
  }
  if (value === "it") {
    return "it-IT";
  }
  if (value === "de") {
    return "de-DE";
  }

  return PRIMARY_UI_LOCALE;
}

export function translateMessage(
  catalog: LocalizationCatalog,
  locale: PlatformLocale,
  key: string
): TranslationLookupResult {
  const requestedValue = catalog[locale]?.[key];
  if (requestedValue !== undefined) {
    return {
      locale,
      key,
      value: requestedValue,
      missing: false
    };
  }

  const fallbackValue = catalog[FALLBACK_UI_LOCALE]?.[key];
  if (fallbackValue !== undefined) {
    return {
      locale,
      fallbackLocale: FALLBACK_UI_LOCALE,
      key,
      value: fallbackValue,
      missing: false
    };
  }

  return {
    locale,
    fallbackLocale: FALLBACK_UI_LOCALE,
    key,
    value: key,
    missing: true
  };
}

export function validateLocalizationCatalog(
  catalog: LocalizationCatalog,
  requiredKeys: readonly string[]
): readonly LocalizationValidationIssue[] {
  const issues: LocalizationValidationIssue[] = [];

  for (const locale of SUPPORTED_UI_LOCALES) {
    const messages = catalog[locale];
    for (const key of requiredKeys) {
      const value = messages?.[key];
      if (value === undefined) {
        issues.push({ locale, key, code: "MISSING_LOCALIZATION_KEY" });
      } else if (value.trim().length === 0) {
        issues.push({ locale, key, code: "EMPTY_LOCALIZATION_VALUE" });
      }
    }
  }

  return issues;
}

export function isPlatformLocale(value: string | undefined): value is PlatformLocale {
  return SUPPORTED_UI_LOCALES.some((locale) => locale === value);
}
