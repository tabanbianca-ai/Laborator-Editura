"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  acceptEditorialCorrection,
  advanceReviewWorkflow,
  approveReviewDocument,
  completeEditorialReviewWithoutChanges,
  createEditorialCorrection,
  rejectEditorialCorrection,
  requestEditorialChanges,
  unblockReviewWorkflow
} from "./review-workspace-client";

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

export async function advanceReviewWorkflowAction(formData: FormData): Promise<void> {
  await runDocumentAction(formData, () => advanceReviewWorkflow(readWorkflowTarget(formData)));
}

export async function unblockReviewWorkflowAction(formData: FormData): Promise<void> {
  await runDocumentAction(formData, () =>
    unblockReviewWorkflow({
      ...readWorkflowTarget(formData),
      reason: readOptionalString(formData, "reason") ?? "Authorized human resumed editorial review."
    })
  );
}

export async function createEditorialCorrectionAction(formData: FormData): Promise<void> {
  const documentId = readRequiredString(formData, "documentId");
  const segmentId = readRequiredString(formData, "segmentId");
  const result = await createEditorialCorrection({
    documentId,
    explanation: readOptionalString(formData, "explanation"),
    issueType: readRequiredString(formData, "issueType"),
    projectId: readRequiredString(formData, "projectId"),
    proposedText: readRequiredString(formData, "proposedText"),
    segmentId,
    severity: readSeverity(formData),
    sourceLanguage: readRequiredString(formData, "sourceLanguage"),
    sourceText: readRequiredString(formData, "sourceText"),
    targetLanguage: readRequiredString(formData, "targetLanguage"),
    targetText: readRequiredString(formData, "targetText"),
    translationId: readOptionalString(formData, "translationId")
  });
  redirectFromResult(documentId, segmentId, result.error, "Correction could not be proposed.");
}

export async function acceptEditorialCorrectionAction(formData: FormData): Promise<void> {
  const id = readRequiredString(formData, "proposalId");
  await runDocumentAction(formData, () => acceptEditorialCorrection(id));
}

export async function rejectEditorialCorrectionAction(formData: FormData): Promise<void> {
  const id = readRequiredString(formData, "proposalId");
  await runDocumentAction(formData, () => rejectEditorialCorrection(id));
}

export async function requestEditorialChangesAction(formData: FormData): Promise<void> {
  const documentId = readRequiredString(formData, "documentId");
  const segmentId = readOptionalString(formData, "segmentId");
  const result = await requestEditorialChanges({
    documentId,
    projectId: readOptionalString(formData, "projectId"),
    reason: readRequiredString(formData, "reason"),
    segmentId,
    sourceLanguage: readRequiredString(formData, "sourceLanguage"),
    sourceText: readRequiredString(formData, "sourceText"),
    targetLanguage: readRequiredString(formData, "targetLanguage"),
    targetText: readRequiredString(formData, "targetText")
  });
  redirectFromResult(documentId, segmentId, result.error, "Changes could not be requested.");
}

export async function completeEditorialReviewAction(formData: FormData): Promise<void> {
  const documentId = readRequiredString(formData, "documentId");
  const segmentId = readOptionalString(formData, "segmentId");
  const result = await completeEditorialReviewWithoutChanges({
    documentId,
    projectId: readOptionalString(formData, "projectId"),
    segmentId,
    sourceLanguage: readRequiredString(formData, "sourceLanguage"),
    sourceText: readRequiredString(formData, "sourceText"),
    targetLanguage: readRequiredString(formData, "targetLanguage"),
    targetText: readRequiredString(formData, "targetText")
  });
  redirectFromResult(documentId, segmentId, result.error, "Editorial review could not be completed.");
}

function readWorkflowTarget(formData: FormData): { documentId: string; projectId?: string } {
  return {
    documentId: readRequiredString(formData, "documentId"),
    projectId: readOptionalString(formData, "projectId")
  };
}

async function runDocumentAction(
  formData: FormData,
  action: () => Promise<{ data: unknown | null; error: string | null }>
): Promise<void> {
  const documentId = readRequiredString(formData, "documentId");
  const segmentId = readOptionalString(formData, "segmentId");
  const result = await action();
  redirectFromResult(documentId, segmentId, result.error, "Editorial action could not be completed.");
}

function redirectFromResult(
  documentId: string,
  segmentId: string | undefined,
  error: string | null,
  fallbackError: string
): never {
  const query = new URLSearchParams({ documentId });
  if (segmentId) {
    query.set("segmentId", segmentId);
  }
  if (error) {
    query.set("error", error || fallbackError);
  }
  revalidatePath("/review");
  redirect(`/review?${query.toString()}`);
}

function readSeverity(formData: FormData): "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" {
  const value = readRequiredString(formData, "severity");
  return value === "LOW" || value === "MEDIUM" || value === "CRITICAL" ? value : "HIGH";
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
