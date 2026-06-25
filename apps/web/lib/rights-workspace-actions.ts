"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  createCollaborationAgreement,
  createProvenanceRecord,
  createPublishingAuthorization,
  createTranslationAuthorization,
  type CollaborationAgreementStatus,
  type CollaborationAgreementType
} from "./rights-workspace-client";

export async function createRightsContractAction(formData: FormData): Promise<void> {
  const result = await createCollaborationAgreement({
    agreementType: readRequiredString(formData, "agreementType") as CollaborationAgreementType,
    attachedDocumentMetadata: readDocumentMetadata(formData, "attachedDocument"),
    collaboratorId: readOptionalString(formData, "collaboratorId"),
    collaboratorName: readRequiredString(formData, "collaboratorName"),
    documentId: readOptionalString(formData, "documentId"),
    endDate: readOptionalString(formData, "endDate"),
    notes: readOptionalString(formData, "notes"),
    projectId: readOptionalString(formData, "projectId"),
    startDate: readOptionalString(formData, "startDate"),
    status: readOptionalString(formData, "status") as CollaborationAgreementStatus | undefined
  });

  finishRightsMutation("collaboration", result.error, result.data?.id);
}

export async function createTranslationRightsAction(formData: FormData): Promise<void> {
  const result = await createTranslationAuthorization({
    authorizationDocumentMetadata: readDocumentMetadata(formData, "authorizationDocument"),
    authorizedLanguages: splitCsv(readOptionalString(formData, "authorizedLanguages")),
    documentId: readOptionalString(formData, "documentId"),
    notes: readOptionalString(formData, "notes"),
    originalAuthor: readOptionalString(formData, "originalAuthor"),
    projectId: readOptionalString(formData, "projectId"),
    rightsHolder: readOptionalString(formData, "rightsHolder"),
    territories: splitCsv(readOptionalString(formData, "territories")),
    translationAuthorized: readCheckbox(formData, "translationAuthorized"),
    validUntil: readOptionalString(formData, "validUntil")
  });

  finishRightsMutation("translation", result.error, result.data?.id);
}

export async function createPublishingRightsAction(formData: FormData): Promise<void> {
  const result = await createPublishingAuthorization({
    audiobookAllowed: readCheckbox(formData, "audiobookAllowed"),
    commercialDistributionAllowed: readCheckbox(formData, "commercialDistributionAllowed"),
    documentId: readOptionalString(formData, "documentId"),
    ebookAllowed: readCheckbox(formData, "ebookAllowed"),
    mobiAllowed: readCheckbox(formData, "mobiAllowed"),
    notes: readOptionalString(formData, "notes"),
    pdfAllowed: readCheckbox(formData, "pdfAllowed"),
    printAllowed: readCheckbox(formData, "printAllowed"),
    projectId: readOptionalString(formData, "projectId"),
    publicationAuthorized: readCheckbox(formData, "publicationAuthorized"),
    videoAllowed: readCheckbox(formData, "videoAllowed")
  });

  finishRightsMutation("publishing", result.error, result.data?.id);
}

export async function createProvenanceRecordAction(formData: FormData): Promise<void> {
  const result = await createProvenanceRecord({
    documentId: readOptionalString(formData, "documentId"),
    firstPublicationYear: readOptionalNumber(formData, "firstPublicationYear"),
    metadata: readOptionalString(formData, "metadataReference")
      ? { reference: readOptionalString(formData, "metadataReference") }
      : undefined,
    originalAuthor: readOptionalString(formData, "originalAuthor"),
    originalEdition: readOptionalString(formData, "originalEdition"),
    originalLanguage: readOptionalString(formData, "originalLanguage"),
    originalPublisher: readOptionalString(formData, "originalPublisher"),
    originalSourceReference: readOptionalString(formData, "originalSourceReference"),
    originalTitle: readOptionalString(formData, "originalTitle"),
    projectId: readOptionalString(formData, "projectId"),
    publicationHistory: splitCsv(readOptionalString(formData, "publicationHistory")),
    publisher: readOptionalString(formData, "publisher"),
    reviewer: readOptionalString(formData, "reviewer"),
    translator: readOptionalString(formData, "translator")
  });

  finishRightsMutation("provenance", result.error, result.data?.id);
}

function finishRightsMutation(tab: string, error: string | null, createdId?: string): never {
  const query = new URLSearchParams({ tab });

  if (createdId) {
    query.set("createdId", createdId);
  }

  if (error) {
    query.set("error", error);
  }

  revalidatePath("/rights");
  redirect(`/rights?${query.toString()}`);
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

function readCheckbox(formData: FormData, fieldName: string): boolean {
  return formData.get(fieldName) === "on";
}

function readDocumentMetadata(formData: FormData, prefix: string) {
  const fileName = readOptionalString(formData, `${prefix}FileName`);
  const reference = readOptionalString(formData, `${prefix}Reference`);

  if (!fileName && !reference) {
    return undefined;
  }

  return {
    fileName,
    reference
  };
}

function splitCsv(value: string | undefined): string[] {
  if (!value) {
    return [];
  }

  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}
