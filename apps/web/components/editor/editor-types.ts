export type EditorSaveStatus = "Failed" | "Saved" | "Saving" | "Unsaved";

export interface EditorSegment {
  documentId: string;
  id: string;
  latestTranslationId?: string;
  number: number;
  projectId: string;
  source: string;
  sourceLanguage: string;
  status: string;
  target: string;
  targetLanguage: string;
}
