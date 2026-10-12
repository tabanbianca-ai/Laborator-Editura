"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  createDocumentSegment,
  importDocxDocument
} from "./projects-documents-api";

export async function importDocxAction(formData: FormData): Promise<void> {
  const result = await importDocxDocument(formData);

  if (result.error || !result.data) {
    redirect(`/documents?importError=${encodeURIComponent(result.error ?? "DOCX import failed.")}`);
  }

  revalidatePath("/documents");
  redirect(
    `/documents/${encodeURIComponent(result.data.document.id)}?imported=${result.data.duplicate ? "existing" : "created"}`
  );
}

export async function createDocumentSegmentAction(formData: FormData): Promise<void> {
  const documentId = readString(formData, "documentId");
  const projectId = readString(formData, "projectId");
  const sourceText = readString(formData, "sourceText");
  const result = await createDocumentSegment({ documentId, projectId, sourceText });

  if (result.error || !result.data) {
    redirect(
      `/documents/${encodeURIComponent(documentId)}?segmentError=${encodeURIComponent(result.error ?? "Segment creation failed.")}`
    );
  }

  revalidatePath(`/documents/${documentId}`);
  redirect(`/documents/${encodeURIComponent(documentId)}`);
}

function readString(formData: FormData, name: string): string {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}
