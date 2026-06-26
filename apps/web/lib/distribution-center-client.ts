import {
  getPublishingWorkspaceData,
  type LayoutPublicationPlanRecord,
  type PublishingWorkspaceData
} from "./publishing-workspace-client";

export type PreflightStatus = "READY" | "WARNING" | "BLOCKED";
export type DistributionChannelName =
  | "Print PDF"
  | "Digital PDF"
  | "EPUB"
  | "MOBI"
  | "Audiobook"
  | "Video"
  | "Magazine Flipbook"
  | "Public Portal";

export interface PreflightCheck {
  blockers: string[];
  label: string;
  status: PreflightStatus;
}

export interface DistributionChannel {
  blockers: string[];
  lastExportDate: string;
  name: DistributionChannelName;
  publishReadiness: PreflightStatus;
  requiredApprovals: string[];
  status: string;
}

export interface DistributionCenterData {
  channels: DistributionChannel[];
  preflightChecks: PreflightCheck[];
  readyCount: number;
  blockedCount: number;
  warningCount: number;
  workspace: PublishingWorkspaceData;
}

export async function getDistributionCenterData(input: {
  commerceEditionId?: string;
  documentId?: string;
  exportArtifactId?: string;
  layoutPlanId?: string;
  publicCatalogItemId?: string;
}): Promise<DistributionCenterData> {
  const workspace = await getPublishingWorkspaceData(input);
  const preflightChecks = buildPreflightChecks(workspace);
  const channels = buildDistributionChannels(workspace);

  return {
    blockedCount: preflightChecks.filter((check) => check.status === "BLOCKED").length,
    channels,
    preflightChecks,
    readyCount: preflightChecks.filter((check) => check.status === "READY").length,
    warningCount: preflightChecks.filter((check) => check.status === "WARNING").length,
    workspace
  };
}

function buildPreflightChecks(workspace: PublishingWorkspaceData): PreflightCheck[] {
  const hasDocument = Boolean(workspace.selectedDocument);
  const hasLayoutPlan = Boolean(workspace.layoutPlan);
  const hasJsonMaster = Boolean(workspace.artifact);
  const rightsBlocked = workspace.rightsWarnings.some((warning) => warning.severity === "danger");
  const rightsWarnings = workspace.rightsWarnings.length > 0;
  const approved =
    workspace.workflow?.status === "APPROVED" ||
    workspace.workflow?.status === "READY_FOR_EXPORT" ||
    workspace.workflow?.status === "EXPORTED" ||
    workspace.selectedDocument?.status === "APPROVED" ||
    workspace.selectedDocument?.status === "EXPORTED";
  const exported =
    workspace.workflow?.status === "EXPORTED" ||
    workspace.selectedDocument?.status === "EXPORTED";
  const isMagazine = isMagazineDocument(workspace.selectedDocument?.documentType);

  return [
    check("ISBN", Boolean(workspace.commerceEdition?.metadata.isbn), ["ISBN metadata is not linked."]),
    check("Metadata", hasDocument && Boolean(workspace.selectedProject), ["Project/document metadata is incomplete."]),
    check(
      "Rights/provenance",
      !rightsWarnings,
      workspace.rightsWarnings.map((warning) => warning.message),
      rightsBlocked ? "BLOCKED" : "WARNING"
    ),
    check("Cover", hasLayoutPlan || Boolean(workspace.commerceEdition), ["Cover metadata is pending."]),
    check("Fonts", Boolean(workspace.layoutPlan?.editorialFinishing.typographyValidation), ["Typography/font validation is pending."]),
    check("Image resolution", false, ["Image resolution preflight is not recorded yet."], "WARNING"),
    check("Table of contents", hasLayoutPlan, ["Table of contents/layout plan is not linked."]),
    check("Hyperlinks", hasJsonMaster, ["Hyperlink validation requires JSON Master/export metadata."]),
    check("PDF print", hasFormatExport(workspace.layoutPlan, "PDF") || hasFormatExport(workspace.layoutPlan, "PRINT_ON_DEMAND"), ["Print PDF export is missing."]),
    check("EPUB", hasFormatExport(workspace.layoutPlan, "EPUB"), ["EPUB export is missing."]),
    check("MOBI", hasFormatExport(workspace.layoutPlan, "MOBI"), ["MOBI export is missing."]),
    check("JSON master", hasJsonMaster, ["JSON Master artifact is missing."]),
    check("Audiobook", exported && !rightsBlocked, [exported ? "Audiobook rights/readiness need review." : "Final approved/exported text required for audiobook."], "WARNING"),
    check("Video", exported && !rightsBlocked, [exported ? "Video rights/readiness need review." : "Final approved/exported text required for video."], "WARNING"),
    check("Magazine flipbook", isMagazine && (hasFormatExport(workspace.layoutPlan, "PDF") || exported), [isMagazine ? "Magazine flipbook requires PDF/exported layout." : "Not a magazine issue/article."], "WARNING"),
    check("Final approval", approved && !rightsBlocked, [rightsBlocked ? "Rights blockers must be resolved." : "Human final approval is required."])
  ];
}

function buildDistributionChannels(workspace: PublishingWorkspaceData): DistributionChannel[] {
  const rightsBlocked = workspace.rightsWarnings.some((warning) => warning.severity === "danger");
  const approved =
    workspace.workflow?.status === "APPROVED" ||
    workspace.workflow?.status === "READY_FOR_EXPORT" ||
    workspace.workflow?.status === "EXPORTED" ||
    workspace.selectedDocument?.status === "APPROVED" ||
    workspace.selectedDocument?.status === "EXPORTED";
  const exported =
    workspace.workflow?.status === "EXPORTED" ||
    workspace.selectedDocument?.status === "EXPORTED";
  const isMagazine = isMagazineDocument(workspace.selectedDocument?.documentType);

  return [
    channel("Print PDF", workspace, ["Human layout approval", "Publishing rights"], [
      ...blockIf(!approved, "Human approval is required."),
      ...blockIf(rightsBlocked, "Rights blockers must be resolved."),
      ...blockIf(!hasFormatExport(workspace.layoutPlan, "PDF") && !hasFormatExport(workspace.layoutPlan, "PRINT_ON_DEMAND"), "Print PDF export is missing.")
    ], "PDF"),
    channel("Digital PDF", workspace, ["Human layout approval", "Publishing rights"], [
      ...blockIf(!approved, "Human approval is required."),
      ...blockIf(!hasFormatExport(workspace.layoutPlan, "PDF"), "Digital PDF export is missing.")
    ], "PDF"),
    channel("EPUB", workspace, ["Human layout approval"], [
      ...blockIf(!approved, "Human approval is required."),
      ...blockIf(!hasFormatExport(workspace.layoutPlan, "EPUB"), "EPUB export is missing.")
    ], "EPUB"),
    channel("MOBI", workspace, ["Human layout approval"], [
      ...blockIf(!approved, "Human approval is required."),
      ...blockIf(!hasFormatExport(workspace.layoutPlan, "MOBI"), "MOBI export is missing.")
    ], "MOBI"),
    channel("Audiobook", workspace, ["Human final approval", "Audio rights"], [
      ...blockIf(!exported, "Official audiobook requires final exported text."),
      ...blockIf(rightsBlocked, "Rights blockers must be resolved.")
    ]),
    channel("Video", workspace, ["Human final approval", "Video rights"], [
      ...blockIf(!exported, "Official video requires final exported text."),
      ...blockIf(rightsBlocked, "Rights blockers must be resolved.")
    ]),
    channel("Magazine Flipbook", workspace, ["Human final approval", "PDF export"], [
      ...blockIf(!isMagazine, "Only magazine issues/articles use flipbook distribution."),
      ...blockIf(!hasFormatExport(workspace.layoutPlan, "PDF") && !exported, "Flipbook requires PDF/exported layout.")
    ], "PDF"),
    channel("Public Portal", workspace, ["Human release approval", "Rights/provenance"], [
      ...blockIf(rightsBlocked, "Rights blockers must be resolved."),
      ...blockIf(workspace.publicCatalogItem?.releaseApprovalStatus !== "APPROVED", "Public portal release approval is missing.")
    ])
  ];
}

function check(
  label: string,
  ready: boolean,
  blockers: string[],
  fallbackStatus: PreflightStatus = "BLOCKED"
): PreflightCheck {
  return {
    blockers: ready ? [] : blockers,
    label,
    status: ready ? "READY" : fallbackStatus
  };
}

function channel(
  name: DistributionChannelName,
  workspace: PublishingWorkspaceData,
  requiredApprovals: string[],
  blockers: string[],
  exportFormat?: string
): DistributionChannel {
  return {
    blockers,
    lastExportDate: exportFormat ? latestExportDate(workspace.layoutPlan, exportFormat) : "No export recorded",
    name,
    publishReadiness: blockers.length === 0 ? "READY" : "BLOCKED",
    requiredApprovals,
    status: blockers.length === 0 ? "Ready for human release" : "Blocked"
  };
}

function blockIf(condition: boolean, message: string): string[] {
  return condition ? [message] : [];
}

function hasFormatExport(
  plan: LayoutPublicationPlanRecord | null,
  format: string
): boolean {
  return Boolean(plan?.exportHistory.some((event) => event.format === format));
}

function latestExportDate(
  plan: LayoutPublicationPlanRecord | null,
  format: string
): string {
  const event = [...(plan?.exportHistory ?? [])]
    .filter((item) => item.format === format)
    .sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime())[0];

  return event?.createdAt ?? "No export recorded";
}

function isMagazineDocument(documentType: string | undefined): boolean {
  if (!documentType) {
    return false;
  }

  const normalized = documentType.toUpperCase();

  return normalized === "MAGAZINE" ||
    normalized === "MAGAZINE_ARTICLE" ||
    normalized === "ARTICLE" ||
    normalized.includes("MAGAZINE");
}
