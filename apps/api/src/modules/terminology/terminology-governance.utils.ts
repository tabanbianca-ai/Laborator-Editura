import type {
  TerminologyGovernanceDecisionStatus,
  TerminologyQualityLevel,
  TerminologySource,
  TerminologySourceValidationStatus,
  TerminologyTerm,
  TerminologyValidationStatus
} from "./terminology.types";

const APPROVED_SOURCES = new Set<TerminologySource>([
  "CORPUS",
  "DICTIONARY",
  "EDITORIAL_DECISION",
  "GLOSSARY",
  "IMPORT"
]);

const ROMANIAN_LANGUAGE_CODES = new Set(["ro", "ro-ro", "ron", "rum"]);
const ROMANIAN_CEDILLA_PATTERN = /[ŞşŢţ]/u;
const ROMANIAN_CANONICAL_TERMS = [
  "conștiință",
  "credință",
  "cunoaștere",
  "după",
  "fără",
  "hotărâre",
  "înțelegere",
  "înțelepciune",
  "încercare",
  "înviere",
  "lumină",
  "mântuire",
  "morală",
  "perispirit",
  "reîncarnare",
  "relație",
  "răspundere",
  "săvârșire",
  "tranziție",
  "viață"
];

export function isRomanianLanguage(language: string): boolean {
  return ROMANIAN_LANGUAGE_CODES.has(language.toLocaleLowerCase());
}

export function stripRomanianDiacritics(value: string): string {
  return value
    .replace(/[ăĂ]/gu, "a")
    .replace(/[âÂ]/gu, "a")
    .replace(/[îÎ]/gu, "i")
    .replace(/[șşȘŞ]/gu, "s")
    .replace(/[țţȚŢ]/gu, "t");
}

export function validateRomanianDiacritics(
  language: string,
  values: Array<string | undefined>
): TerminologyValidationStatus {
  if (!isRomanianLanguage(language)) {
    return "NOT_APPLICABLE";
  }

  return values.some((value) => value !== undefined && hasRomanianDiacriticProblem(value))
    ? "FAILED"
    : "PASSED";
}

export function validateRomanianOrthography(
  language: string,
  values: Array<string | undefined>
): TerminologyValidationStatus {
  if (!isRomanianLanguage(language)) {
    return "NOT_APPLICABLE";
  }

  const hasInvalidOrthography = values.some((value) => {
    if (!value) {
      return false;
    }

    return ROMANIAN_CEDILLA_PATTERN.test(value) || hasRomanianDiacriticProblem(value);
  });

  return hasInvalidOrthography ? "FAILED" : "PASSED";
}

export function hasRomanianDiacriticProblem(value: string): boolean {
  const normalized = value.toLocaleLowerCase();
  const folded = stripRomanianDiacritics(normalized);

  return ROMANIAN_CANONICAL_TERMS.some((canonical) => {
    const canonicalFolded = stripRomanianDiacritics(canonical);

    return folded.includes(canonicalFolded) && !normalized.includes(canonical);
  });
}

export function containsNonDiacriticVariant(haystack: string, canonical: string): boolean {
  const normalizedHaystack = haystack.toLocaleLowerCase();
  const normalizedCanonical = canonical.toLocaleLowerCase();
  const foldedCanonical = stripRomanianDiacritics(normalizedCanonical);

  return (
    foldedCanonical !== normalizedCanonical &&
    stripRomanianDiacritics(normalizedHaystack).includes(foldedCanonical) &&
    !normalizedHaystack.includes(normalizedCanonical)
  );
}

export function sourceValidationStatusFor(
  source: TerminologySource,
  referenceSources: string[] | undefined
): TerminologySourceValidationStatus {
  return APPROVED_SOURCES.has(source) || (referenceSources?.length ?? 0) > 0
    ? "APPROVED_SOURCE"
    : "MISSING_APPROVED_SOURCE";
}

export function qualityLevelForScore(score: number): TerminologyQualityLevel {
  if (score >= 90) {
    return "TRUSTED";
  }

  if (score >= 75) {
    return "ACCEPTABLE";
  }

  if (score >= 50) {
    return "REVIEW_REQUIRED";
  }

  return "REJECTED";
}

export function calculateTerminologyQualityScore(input: {
  editorialApproval?: boolean;
  glossaryPresent?: boolean;
  historicalUsageCount?: number;
  orthographicValidationStatus: TerminologyValidationStatus;
  diacriticsValidationStatus: TerminologyValidationStatus;
  referenceSources?: string[];
  source: TerminologySource;
  sourceValidationStatus: TerminologySourceValidationStatus;
  status?: string;
}): number {
  let score = 0;

  if (input.orthographicValidationStatus !== "FAILED") {
    score += 20;
  }

  if (input.diacriticsValidationStatus !== "FAILED") {
    score += 20;
  }

  if (input.sourceValidationStatus === "APPROVED_SOURCE") {
    score += 20;
  }

  if (input.glossaryPresent === true || input.source === "GLOSSARY") {
    score += 10;
  }

  if ((input.referenceSources?.length ?? 0) > 0) {
    score += 10;
  }

  if (
    input.editorialApproval === true ||
    input.source === "EDITORIAL_DECISION" ||
    input.status === "VALIDATED"
  ) {
    score += 10;
  }

  if ((input.historicalUsageCount ?? 0) > 0) {
    score += 10;
  }

  return Math.min(100, score);
}

export function governanceDecisionForEvaluation(input: {
  qualityLevel: TerminologyQualityLevel;
  sourceValidationStatus: TerminologySourceValidationStatus;
  status: string;
}): TerminologyGovernanceDecisionStatus {
  if (input.status === "VALIDATED") {
    return "VALIDATED";
  }

  if (input.status === "REJECTED") {
    return "REJECTED";
  }

  if (input.status === "SUSPENDED") {
    return "SUSPENDED";
  }

  if (input.status === "ARCHIVED") {
    return "ARCHIVED";
  }

  if (input.status === "UNDER_REVIEW") {
    return "UNDER_REVIEW";
  }

  if (input.qualityLevel === "REJECTED") {
    return "UNDER_REVIEW";
  }

  if (input.sourceValidationStatus === "MISSING_APPROVED_SOURCE") {
    return "UNDER_REVIEW";
  }

  return "PENDING";
}

export function buildGovernanceEvaluation(term: TerminologyTerm): Pick<
  TerminologyTerm,
  | "diacriticsValidationStatus"
  | "governanceDecisionStatus"
  | "orthographicValidationStatus"
  | "qualityLevel"
  | "qualityScore"
  | "sourceValidationStatus"
> {
  const values = [
    term.term,
    term.approvedTranslation,
    ...term.preferredVariants,
    ...term.forbiddenVariants
  ];
  const diacriticsValidationStatus = validateRomanianDiacritics(term.language, values);
  const orthographicValidationStatus = validateRomanianOrthography(term.language, values);
  const sourceValidationStatus = sourceValidationStatusFor(
    term.source,
    term.referenceSources
  );
  const qualityScore = calculateTerminologyQualityScore({
    editorialApproval: term.editorialApproval,
    glossaryPresent: term.glossaryPresent,
    historicalUsageCount: term.historicalUsageCount,
    orthographicValidationStatus,
    diacriticsValidationStatus,
    referenceSources: term.referenceSources,
    source: term.source,
    sourceValidationStatus,
    status: term.status
  });
  const qualityLevel = qualityLevelForScore(qualityScore);
  const governanceDecisionStatus = governanceDecisionForEvaluation({
    qualityLevel,
    sourceValidationStatus,
    status: term.status
  });

  return {
    diacriticsValidationStatus,
    governanceDecisionStatus,
    orthographicValidationStatus,
    qualityLevel,
    qualityScore,
    sourceValidationStatus
  };
}
