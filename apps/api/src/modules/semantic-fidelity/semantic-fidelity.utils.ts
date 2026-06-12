import type {
  SemanticFidelityIssue,
  SemanticFidelityIssueType,
  SemanticFidelityRiskLevel
} from "./semantic-fidelity.types";

const REINTERPRETATION_MARKERS = [
  "simbolic",
  "metaforic",
  "probabil",
  "devine",
  "înseamnă",
  "reinterpretat",
  "sugerează"
];

export function normalizeSemanticText(value: string | undefined): string {
  return (value ?? "").trim().replace(/\s+/g, " ");
}

export function lengthRatio(sourceText: string, targetText: string): number {
  const sourceLength = Math.max(normalizeSemanticText(sourceText).length, 1);
  return normalizeSemanticText(targetText).length / sourceLength;
}

export function hasReinterpretationMarker(targetText: string): boolean {
  const normalized = normalizeSemanticText(targetText).toLocaleLowerCase();
  return REINTERPRETATION_MARKERS.some((marker) => normalized.includes(marker));
}

export function calculateSemanticScore(issues: SemanticFidelityIssue[]): number {
  const penalty = issues
    .filter((issue) => issue.status === "OPEN")
    .reduce((total, issue) => total + riskPenalty(issue.riskLevel), 0);

  return Math.max(0, Math.round((100 - penalty) * 100) / 100);
}

export function overallRiskLevel(issues: SemanticFidelityIssue[]): SemanticFidelityRiskLevel {
  if (issues.some((issue) => issue.status === "OPEN" && issue.riskLevel === "CRITICAL")) {
    return "CRITICAL";
  }

  if (issues.some((issue) => issue.status === "OPEN" && issue.riskLevel === "HIGH")) {
    return "HIGH";
  }

  if (issues.some((issue) => issue.status === "OPEN" && issue.riskLevel === "MEDIUM")) {
    return "MEDIUM";
  }

  return "LOW";
}

export function riskForIssue(type: SemanticFidelityIssueType): SemanticFidelityRiskLevel {
  switch (type) {
    case "TERMINOLOGY_MEANING_CONFLICT":
    case "OMITTED_MEANING":
      return "CRITICAL";
    case "MEANING_DRIFT":
    case "UNJUSTIFIED_REINTERPRETATION":
    case "ADDED_MEANING":
      return "HIGH";
    case "CONTEXT_MISMATCH":
      return "MEDIUM";
  }
}

function riskPenalty(risk: SemanticFidelityRiskLevel): number {
  switch (risk) {
    case "LOW":
      return 3;
    case "MEDIUM":
      return 10;
    case "HIGH":
      return 22;
    case "CRITICAL":
      return 40;
  }
}
