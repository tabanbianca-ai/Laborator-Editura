"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  createAuthorManuscript,
  createAuthorSection,
  saveAuthorDraft,
  type AuthorManuscriptType,
  type AuthorSectionType
} from "./author-studio-client";

export async function createManuscriptAction(formData: FormData): Promise<void> {
  const result = await createAuthorManuscript({
    authoringLanguage: readOptionalString(formData, "authoringLanguage"),
    authoringLocale: readOptionalString(formData, "authoringLocale"),
    genre: readOptionalString(formData, "genre"),
    language: readRequiredString(formData, "language"),
    manuscriptType: readRequiredString(formData, "manuscriptType") as AuthorManuscriptType,
    originalLanguage: readOptionalString(formData, "originalLanguage"),
    originalLocale: readOptionalString(formData, "originalLocale"),
    outline: readOptionalString(formData, "outline"),
    sourceManuscriptId: readOptionalString(formData, "sourceManuscriptId"),
    subtitle: readOptionalString(formData, "subtitle"),
    synopsis: readOptionalString(formData, "synopsis"),
    title: readRequiredString(formData, "title"),
    translatorName: readOptionalString(formData, "translatorName")
  });

  if (result.error || !result.data) {
    redirect(`/author-studio/new?error=${encodeURIComponent(result.error ?? "Manuscript could not be created.")}`);
  }

  revalidatePath("/author-studio");
  redirect(`/author-studio/${result.data.id}`);
}

export async function createSectionAction(formData: FormData): Promise<void> {
  const manuscriptId = readRequiredString(formData, "manuscriptId");
  const orderIndex = readOptionalNumber(formData, "orderIndex");
  const result = await createAuthorSection(manuscriptId, {
    notes: readOptionalString(formData, "notes"),
    orderIndex,
    outline: readOptionalString(formData, "outline"),
    sectionType: readRequiredString(formData, "sectionType") as AuthorSectionType,
    synopsis: readOptionalString(formData, "synopsis"),
    title: readRequiredString(formData, "title")
  });

  if (result.error || !result.data) {
    redirect(
      `/author-studio/${encodeURIComponent(manuscriptId)}?sectionError=${encodeURIComponent(
        result.error ?? "Section could not be created."
      )}`
    );
  }

  revalidatePath(`/author-studio/${manuscriptId}`);
  redirect(`/author-studio/${result.data.manuscriptId}`);
}

export async function saveDraftAction(formData: FormData): Promise<void> {
  const manuscriptId = readRequiredString(formData, "manuscriptId");
  const sectionId = readRequiredString(formData, "sectionId");
  const result = await saveAuthorDraft(sectionId, {
    autosave: formData.get("autosave") === "on",
    content: readRequiredString(formData, "content")
  });

  if (result.error || !result.data) {
    redirect(
      `/author-studio/${encodeURIComponent(manuscriptId)}?draftError=${encodeURIComponent(
        result.error ?? "Draft could not be saved."
      )}`
    );
  }

  revalidatePath(`/author-studio/${manuscriptId}`);
  redirect(`/author-studio/${result.data.manuscriptId}`);
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

function readOptionalNumber(formData: FormData, fieldName: string): number | undefined {
  const value = readRequiredString(formData, fieldName);

  if (value.length === 0) {
    return undefined;
  }

  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : undefined;
}
