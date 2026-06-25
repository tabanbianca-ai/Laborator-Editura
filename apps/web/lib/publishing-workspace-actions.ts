"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  approveLayoutPublication,
  createJsonMasterExport,
  recordLayoutExport,
  type PublishingExportFormat
} from "./publishing-workspace-client";

export async function createPublishingExportAction(formData: FormData): Promise<void> {
  const documentId = readRequiredString(formData, "documentId");
  const projectId = readRequiredString(formData, "projectId");
  const result = await createJsonMasterExport({
    documentId,
    projectId
  });
  const query = new URLSearchParams({
    documentId
  });

  if (result.data?.id) {
    query.set("exportArtifactId", result.data.id);
  }

  if (result.error || !result.data) {
    query.set("error", result.error ?? "Export could not be created.");
    redirect(`/publishing?${query.toString()}`);
  }

  revalidatePath("/publishing");
  redirect(`/publishing?${query.toString()}`);
}

export async function approveLayoutPublicationAction(formData: FormData): Promise<void> {
  const documentId = readOptionalString(formData, "documentId");
  const planId = readRequiredString(formData, "layoutPlanId");
  const result = await approveLayoutPublication({ planId });
  const query = new URLSearchParams({
    layoutPlanId: planId
  });

  if (documentId) {
    query.set("documentId", documentId);
  }

  if (result.error || !result.data) {
    query.set("error", result.error ?? "Publication approval could not be completed.");
    redirect(`/publishing?${query.toString()}`);
  }

  revalidatePath("/publishing");
  redirect(`/publishing?${query.toString()}`);
}

export async function recordLayoutExportAction(formData: FormData): Promise<void> {
  const documentId = readOptionalString(formData, "documentId");
  const planId = readRequiredString(formData, "layoutPlanId");
  const format = readRequiredString(formData, "format") as PublishingExportFormat;
  const artifactUri = readOptionalString(formData, "artifactUri");
  const result = await recordLayoutExport({
    artifactUri,
    format,
    planId
  });
  const query = new URLSearchParams({
    layoutPlanId: planId
  });

  if (documentId) {
    query.set("documentId", documentId);
  }

  if (result.error || !result.data) {
    query.set("error", result.error ?? "Layout export record could not be created.");
    redirect(`/publishing?${query.toString()}`);
  }

  revalidatePath("/publishing");
  redirect(`/publishing?${query.toString()}`);
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
