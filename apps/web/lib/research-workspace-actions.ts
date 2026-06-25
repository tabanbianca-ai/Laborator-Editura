"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  createResearchSource,
  type ResearchSourceType,
  type ResearchVisibility
} from "./research-workspace-client";

export async function createResearchSourceAction(formData: FormData): Promise<void> {
  const title = readRequiredString(formData, "title");
  const language = readRequiredString(formData, "language");
  const sourceType = readRequiredString(formData, "sourceType") as ResearchSourceType;
  const visibility = readOptionalString(formData, "visibility") as ResearchVisibility | undefined;
  const firstPublicationYear = readOptionalNumber(formData, "firstPublicationYear");
  const result = await createResearchSource({
    author: readOptionalString(formData, "author"),
    citation: readOptionalString(formData, "citation"),
    firstPublicationYear,
    language,
    notes: readOptionalString(formData, "notes"),
    originalLanguage: readOptionalString(formData, "originalLanguage"),
    sourceType,
    tags: splitTags(readOptionalString(formData, "tags")),
    title,
    visibility
  });

  if (result.error || !result.data) {
    redirect(`/research?error=${encodeURIComponent(result.error ?? "Research source could not be created.")}`);
  }

  revalidatePath("/research");
  redirect(`/research?sourceId=${encodeURIComponent(result.data.id)}`);
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

function splitTags(value: string | undefined): string[] | undefined {
  if (!value) {
    return undefined;
  }

  return value
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}
