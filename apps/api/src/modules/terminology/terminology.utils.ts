import type { TerminologyTerm } from "./terminology.types";

export function normalizeTerminologyText(value: string): string {
  return value.trim().replace(/\s+/g, " ").toLocaleLowerCase();
}

export function includesNormalized(haystack: string, needle: string): boolean {
  return normalizeTerminologyText(haystack).includes(normalizeTerminologyText(needle));
}

export function uniqueStrings(values: string[] | undefined): string[] {
  return [...new Set((values ?? []).map((value) => value.trim()).filter(Boolean))];
}

export function sortTermsByAuthority(terms: TerminologyTerm[]): TerminologyTerm[] {
  return [...terms].sort((left, right) => {
    const leftPriority = left.status === "VALIDATED" ? 0 : 1;
    const rightPriority = right.status === "VALIDATED" ? 0 : 1;

    if (leftPriority !== rightPriority) {
      return leftPriority - rightPriority;
    }

    return right.updatedAt.localeCompare(left.updatedAt);
  });
}
