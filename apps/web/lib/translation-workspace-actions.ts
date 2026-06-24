"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { submitWorkspaceTranslation } from "./translation-workspace-client";

export async function saveWorkspaceTranslationAction(formData: FormData): Promise<void> {
  const documentId = readRequiredString(formData, "documentId");
  const segmentId = readRequiredString(formData, "segmentId");
  const targetText = readRequiredString(formData, "targetText");
  const translatorName = readOptionalString(formData, "translatorName");
  const originalAuthorName = readOptionalString(formData, "originalAuthorName");
  const result = await submitWorkspaceTranslation({
    metadata: {
      originalAuthorName
    },
    segmentId,
    targetText,
    translatorName
  });
  const query = `documentId=${encodeURIComponent(documentId)}&segmentId=${encodeURIComponent(segmentId)}`;

  if (result.error || !result.data) {
    redirect(`/translation?${query}&error=${encodeURIComponent(result.error ?? "Translation could not be saved.")}`);
  }

  revalidatePath("/translation");
  redirect(`/translation?${query}`);
}

function readRequiredString(formData: FormData, fieldName: string): string {
  const value = formData.get(fieldName);

  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}

function readOptionalString(formData: FormData, fieldName: string): string | undefined {
  const value = readRequiredString(formData, fieldName);

  return value.length > 0 ? value : undefined;
}
