import type { TranslationMemoryEntry } from "./translation-memory.types";

export function normalizeTmText(value: string): string {
  return value.trim().replace(/\s+/g, " ").toLocaleLowerCase();
}

export function calculateFuzzyScore(source: string, query: string): number {
  const normalizedSource = normalizeTmText(source);
  const normalizedQuery = normalizeTmText(query);

  if (normalizedSource.length === 0 || normalizedQuery.length === 0) {
    return 0;
  }

  if (normalizedSource === normalizedQuery) {
    return 1;
  }

  const sourceTokens = toTokenSet(normalizedSource);
  const queryTokens = toTokenSet(normalizedQuery);
  const tokenScore = diceCoefficient(sourceTokens, queryTokens);

  const sourceTrigrams = toTrigramSet(normalizedSource);
  const queryTrigrams = toTrigramSet(normalizedQuery);
  const trigramScore = diceCoefficient(sourceTrigrams, queryTrigrams);

  return roundScore(tokenScore * 0.35 + trigramScore * 0.65);
}

export function sortTranslationMemoryMatches(
  entries: TranslationMemoryEntry[],
  sourceText: string,
  similarityThreshold: number,
  limit: number
): Array<{ entry: TranslationMemoryEntry; similarityScore: number }> {
  return entries
    .map((entry) => ({
      entry,
      similarityScore: calculateFuzzyScore(entry.sourceText, sourceText)
    }))
    .filter((match) => match.similarityScore >= similarityThreshold)
    .sort((left, right) => {
      if (right.similarityScore !== left.similarityScore) {
        return right.similarityScore - left.similarityScore;
      }

      if (right.entry.confidenceScore !== left.entry.confidenceScore) {
        return right.entry.confidenceScore - left.entry.confidenceScore;
      }

      return right.entry.createdAt.localeCompare(left.entry.createdAt);
    })
    .slice(0, limit);
}

function toTokenSet(value: string): Set<string> {
  return new Set(value.split(/\s+/).filter(Boolean));
}

function toTrigramSet(value: string): Set<string> {
  const padded = `  ${value}  `;
  const trigrams = new Set<string>();

  for (let index = 0; index <= padded.length - 3; index += 1) {
    trigrams.add(padded.slice(index, index + 3));
  }

  return trigrams;
}

function diceCoefficient(left: Set<string>, right: Set<string>): number {
  if (left.size === 0 || right.size === 0) {
    return 0;
  }

  let intersection = 0;

  for (const value of left) {
    if (right.has(value)) {
      intersection += 1;
    }
  }

  return (2 * intersection) / (left.size + right.size);
}

function roundScore(value: number): number {
  return Math.round(value * 10000) / 10000;
}
