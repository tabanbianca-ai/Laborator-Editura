"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { approveReviewDocument } from "./review-workspace-client";

export async function approveReviewAction(formData: FormData): Promise<void> {
  const documentId = readRequiredString(formData, "documentId");
  const projectId = readOptionalString(formData, "projectId");
  const segmentId = readOptionalString(formData, "segmentId");
  const result = await approveReviewDocument({
    documentId,
    projectId
  });
  const query = new URLSearchParams({
    documentId
  });

  if (segmentId) {
    query.set("segmentId", segmentId);
  }

  if (result.error || !result.data) {
    query.set("error", result.error ?? "Review could not be approved.");
    redirect(`/review?${query.toString()}`);
  }

  revalidatePath("/review");
  redirect(`/review?${query.toString()}`);
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
