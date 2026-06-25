"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  addLibraryBookmark,
  addLibraryHighlight,
  addLibraryNote,
  favoriteLibraryItem,
  unfavoriteLibraryItem,
  updateReadingProgress
} from "./library-workspace-client";

export async function updateLibraryProgressAction(formData: FormData): Promise<void> {
  const itemId = readRequiredString(formData, "itemId");
  const result = await updateReadingProgress({
    currentChapter: readOptionalString(formData, "currentChapter"),
    currentSection: readOptionalString(formData, "currentSection"),
    itemId,
    position: readOptionalString(formData, "position"),
    progressPercent: readOptionalNumber(formData, "progressPercent")
  });

  redirectAfterLibraryAction(itemId, result.error, "progress");
}

export async function addLibraryBookmarkAction(formData: FormData): Promise<void> {
  const itemId = readRequiredString(formData, "itemId");
  const result = await addLibraryBookmark({
    chapter: readOptionalString(formData, "chapter"),
    itemId,
    label: readOptionalString(formData, "label"),
    position: readOptionalString(formData, "position"),
    section: readOptionalString(formData, "section")
  });

  redirectAfterLibraryAction(itemId, result.error, "bookmark");
}

export async function addLibraryHighlightAction(formData: FormData): Promise<void> {
  const itemId = readRequiredString(formData, "itemId");
  const result = await addLibraryHighlight({
    chapter: readOptionalString(formData, "chapter"),
    color: readOptionalString(formData, "color"),
    itemId,
    note: readOptionalString(formData, "note"),
    position: readOptionalString(formData, "position"),
    section: readOptionalString(formData, "section"),
    text: readRequiredString(formData, "text")
  });

  redirectAfterLibraryAction(itemId, result.error, "highlight");
}

export async function addLibraryNoteAction(formData: FormData): Promise<void> {
  const itemId = readRequiredString(formData, "itemId");
  const result = await addLibraryNote({
    chapter: readOptionalString(formData, "chapter"),
    content: readRequiredString(formData, "content"),
    itemId,
    position: readOptionalString(formData, "position"),
    section: readOptionalString(formData, "section")
  });

  redirectAfterLibraryAction(itemId, result.error, "note");
}

export async function favoriteLibraryItemAction(formData: FormData): Promise<void> {
  const itemId = readRequiredString(formData, "itemId");
  const result = await favoriteLibraryItem(itemId);

  redirectAfterLibraryAction(itemId, result.error, "favorite");
}

export async function unfavoriteLibraryItemAction(formData: FormData): Promise<void> {
  const itemId = readRequiredString(formData, "itemId");
  const result = await unfavoriteLibraryItem(itemId);

  redirectAfterLibraryAction(itemId, result.error, "unfavorite");
}

function redirectAfterLibraryAction(itemId: string, error: string | null, status: string): never {
  const query = new URLSearchParams({
    itemId
  });

  if (error) {
    query.set("error", error);
  } else {
    query.set("status", status);
    revalidatePath("/library");
  }

  redirect(`/library?${query.toString()}`);
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
  const value = readOptionalString(formData, fieldName);

  if (!value) {
    return undefined;
  }

  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : undefined;
}
