"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  assignProjectDossierItem,
  createProject,
  createProjectDossier,
  type ProjectCapability,
  type ProjectDossierItemType,
  type ProjectEditorialDomain,
  type ProjectOrigin,
  type ProjectPublicationType,
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
    publicationType: readRequiredString(formData, "publicationType") as ProjectPublicationType,
    editorialDomain: readRequiredString(formData, "editorialDomain") as ProjectEditorialDomain,
    editorialClassification: {
      collection: readOptionalString(formData, "editorialCollection"),
      series: readOptionalString(formData, "editorialSeries"),
      volume: readOptionalString(formData, "editorialVolume")
    },
    capabilities: readStringList(formData, "capabilities") as ProjectCapability[],
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

export async function createProjectDossierAction(formData: FormData): Promise<void> {
  const projectId = readRequiredString(formData, "projectId");
  const result = await createProjectDossier(projectId, {
    name: readRequiredString(formData, "name"),
    parentDossierId: readOptionalString(formData, "parentDossierId")
  });

  finishProjectDossierMutation(projectId, result.error, "dossierError");
}

export async function assignProjectDossierItemAction(formData: FormData): Promise<void> {
  const projectId = readRequiredString(formData, "projectId");
  const result = await assignProjectDossierItem(projectId, {
    dossierId: readRequiredString(formData, "dossierId"),
    itemId: readRequiredString(formData, "itemId"),
    itemType: readRequiredString(formData, "itemType") as ProjectDossierItemType,
    label: readOptionalString(formData, "label")
  });

  finishProjectDossierMutation(projectId, result.error, "assignError");
}

function finishProjectDossierMutation(projectId: string, error: string | null, errorKey: string): never {
  if (error) {
    redirect(`/projects/${encodeURIComponent(projectId)}?${errorKey}=${encodeURIComponent(error)}`);
  }

  revalidatePath(`/projects/${projectId}`);
  revalidatePath(`/pipeline/${projectId}`);
  redirect(`/projects/${projectId}`);
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

function readStringList(formData: FormData, fieldName: string): string[] {
  return formData
    .getAll(fieldName)
    .filter((value): value is string => typeof value === "string")
    .map((value) => value.trim())
    .filter((value) => value.length > 0);
}
