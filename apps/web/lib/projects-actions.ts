"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  createProject,
  type ProjectOrigin,
  type ProjectRightsStatus
} from "./projects-documents-api";

export async function createProjectAction(formData: FormData): Promise<void> {
  const targetLanguage = readRequiredString(formData, "targetLanguage");
  const targetLocale = readOptionalString(formData, "targetLocale");
  const linkedRightsContractIds = readOptionalString(formData, "linkedRightsContractIds")
    ?.split(",")
    .map((contractId) => contractId.trim())
    .filter((contractId) => contractId.length > 0);

  const result = await createProject({
    description: readOptionalString(formData, "description"),
    domain: readOptionalString(formData, "domain"),
    name: readRequiredString(formData, "name"),
    originalLanguage: readOptionalString(formData, "originalLanguage"),
    originalLocale: readOptionalString(formData, "originalLocale"),
    projectIdentity: {
      linkedRightsContractIds,
      originalAuthor: {
        country: readOptionalString(formData, "originalAuthorCountry"),
        name: readOptionalString(formData, "originalAuthorName"),
        originalLanguage: readOptionalString(formData, "originalAuthorLanguage")
      },
      projectOrigin: readRequiredString(formData, "projectOrigin") as ProjectOrigin,
      rightsStatus: readRequiredString(formData, "rightsStatus") as ProjectRightsStatus
    },
    sourceLanguage: readRequiredString(formData, "sourceLanguage"),
    targetLanguages: targetLanguage ? [targetLanguage] : [],
    targetLocales: targetLocale ? [targetLocale] : undefined
  });

  if (result.error || !result.data) {
    redirect(`/projects/new?error=${encodeURIComponent(result.error ?? "Project could not be created.")}`);
  }

  revalidatePath("/projects");
  revalidatePath("/pipeline");
  redirect(`/pipeline/${result.data.id}`);
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
