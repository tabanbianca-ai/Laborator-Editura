import type { QaIssue, QaIssueSeverity, QaIssueType, QaSegmentInput } from "./qa.types";

const TERMINAL_PUNCTUATION = /[.!?;:]+$/u;
const NUMBER_PATTERN = /[-+]?\d+(?:[.,]\d+)?/gu;
const DATE_PATTERN = /\b(?:\d{1,2}[\/.-]\d{1,2}[\/.-]\d{2,4}|\d{4}[\/.-]\d{1,2}[\/.-]\d{1,2})\b/gu;

export function normalizeQaText(value: string | undefined): string {
  return (value ?? "").trim().replace(/\s+/g, " ");
}

export function isUntranslated(sourceText: string, targetText: string | undefined): boolean {
  const source = normalizeQaText(sourceText).toLocaleLowerCase();
  const target = normalizeQaText(targetText).toLocaleLowerCase();

  return source.length > 0 && source === target;
}

export function extractNumbers(value: string): string[] {
  return normalizeMatches(value.match(NUMBER_PATTERN));
}

export function extractDates(value: string): string[] {
  return normalizeMatches(value.match(DATE_PATTERN));
}

export function terminalPunctuation(value: string): string {
  const match = normalizeQaText(value).match(TERMINAL_PUNCTUATION);
  return match?.[0] ?? "";
}

export function calculateQaScore(issues: QaIssue[]): number {
  const penalty = issues
    .filter((issue) => issue.status === "OPEN")
    .reduce((total, issue) => total + severityPenalty(issue.severity), 0);

  return Math.max(0, Math.round((100 - penalty) * 100) / 100);
}

export function severityForIssue(type: QaIssueType): QaIssueSeverity {
  switch (type) {
    case "MISSING_TARGET_TRANSLATION":
    case "UNTRANSLATED_SEGMENT":
    case "TERMINOLOGY_VIOLATION":
    case "FORBIDDEN_TERMINOLOGY_VARIANT":
      return "CRITICAL";
    case "NUMBER_MISMATCH":
    case "DATE_MISMATCH":
    case "EMPTY_TRANSLATION":
      return "HIGH";
    case "PUNCTUATION_MISMATCH":
    case "TOO_SHORT_TRANSLATION":
      return "MEDIUM";
    case "REPEATED_SEGMENT":
      return "LOW";
  }
}

export function isTooShortTranslation(segment: QaSegmentInput): boolean {
  const source = normalizeQaText(segment.sourceText);
  const target = normalizeQaText(segment.targetText);

  if (target.length === 0 || source.length < 20) {
    return false;
  }

  return target.length / source.length < 0.35;
}

function normalizeMatches(matches: RegExpMatchArray | null): string[] {
  return [...(matches ?? [])].map((value) => value.replace(",", ".")).sort();
}

function severityPenalty(severity: QaIssueSeverity): number {
  switch (severity) {
    case "LOW":
      return 3;
    case "MEDIUM":
      return 8;
    case "HIGH":
      return 18;
    case "CRITICAL":
      return 35;
  }
}
