"use server";

import { submitTranslation } from "./editor-api";

interface SaveEditorTranslationInput {
  segmentId: string;
  targetText: string;
}

interface SaveEditorTranslationResult {
  error: string | null;
  status: string | null;
  targetText: string | null;
  translationId: string | null;
}

export async function saveEditorTranslation(
  input: SaveEditorTranslationInput
): Promise<SaveEditorTranslationResult> {
  const result = await submitTranslation(input);

  if (result.error || !result.data) {
    return {
      error: result.error ?? "Translation could not be saved.",
      status: null,
      targetText: null,
      translationId: null
    };
  }

  return {
    error: null,
    status: result.data.status,
    targetText: result.data.targetText,
    translationId: result.data.id
  };
}
