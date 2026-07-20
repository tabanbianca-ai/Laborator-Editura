import {
  getPublishingWorkspaceData,
  type LayoutPublicationPlanRecord,
  type PublishingWorkspaceData
} from "./publishing-workspace-client";

export type PreflightStatus = "READY" | "WARNING" | "BLOCKED";
export type OfficialPreflightStatus = "PASS" | "WARNING" | "ERROR" | "NOT_APPLICABLE" | "PENDING";
export type PreflightSeverity = "INFORMATIONAL" | "WARNING" | "CRITICAL";
export type PreflightSourceComponent =
  | "Library"
  | "Quality Agent"
  | "Rights & Provenance"
  | "Translation"
  | "Review"
  | "Layout"
  | "Export"
  | "Publishing"
  | "Workflow";
export type PublishingState =
  | "IN_PREGATIRE"
  | "GATA_PENTRU_PUBLICARE"
  | "PUBLICAT"
  | "REPUBLICAT"
  | "RETRAS_DIN_PUBLICARE";
export type DistributionChannelName =
  | "Biblioteca internă"
  | "Portalul public"
  | "Librăria digitală"
  | "Export extern"
  | "Print-on-Demand";
export type DistributionChannelCode =
  | "INTERNAL_LIBRARY"
  | "PUBLIC_PORTAL"
  | "DIGITAL_BOOKSTORE"
  | "EXTERNAL_EXPORT"
  | "PRINT_ON_DEMAND";

export const publishingExportReferenceLabels = [
  "Print PDF",
  "Digital PDF",
  "EPUB",
  "MOBI",
  "Audiobook",
  "Video",
  "Magazine Flipbook",
  "Public Portal"
] as const;

export interface PreflightCheck {
  blockers: string[];
  label: string;
  lastValidationTimestamp: string;
  message: string;
  officialStatus: OfficialPreflightStatus;
  remediationLink: string;
  severity: PreflightSeverity;
  sourceComponent: PreflightSourceComponent;
  status: PreflightStatus;
}

export interface DistributionChannel {
  blockers: string[];
  code: DistributionChannelCode;
  lastExportDate: string;
  name: DistributionChannelName;
  publishReadiness: PreflightStatus;
  requiredApprovals: string[];
  status: string;
}

export interface DistributionCenterData {
  channels: DistributionChannel[];
  publishingState: PublishingState;
  preflightChecks: PreflightCheck[];
  readinessPercentage: number;
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
    publishingState: preflightChecks.some((check) => check.severity === "CRITICAL" && check.officialStatus === "ERROR")
      ? "IN_PREGATIRE"
      : "GATA_PENTRU_PUBLICARE",
    preflightChecks,
    readinessPercentage: calculateReadinessPercentage(preflightChecks),
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
    check("ISBN", Boolean(workspace.commerceEdition?.metadata.isbn), ["ISBN metadata is not linked."], {
      remediationLink: "/library",
      sourceComponent: "Library"
    }),
    check("Metadata", hasDocument && Boolean(workspace.selectedProject), ["Project/document metadata is incomplete."], {
      remediationLink: "/library",
      sourceComponent: "Library"
    }),
    check(
      "Rights/provenance",
      !rightsWarnings,
      workspace.rightsWarnings.map((warning) => warning.message),
      {
        fallbackStatus: rightsBlocked ? "BLOCKED" : "WARNING",
        remediationLink: "/rights",
        severity: rightsBlocked ? "CRITICAL" : "WARNING",
        sourceComponent: "Rights & Provenance"
      }
    ),
    check("Cover", hasLayoutPlan || Boolean(workspace.commerceEdition), ["Cover metadata is pending."], { sourceComponent: "Layout" }),
    check("Fonts", Boolean(workspace.layoutPlan?.editorialFinishing.typographyValidation), ["Typography/font validation is pending."], { sourceComponent: "Layout" }),
    check("Image resolution", false, ["Image resolution preflight is not recorded yet."], { fallbackStatus: "WARNING", severity: "WARNING", sourceComponent: "Quality Agent" }),
    check("Table of contents", hasLayoutPlan, ["Table of contents/layout plan is not linked."], { sourceComponent: "Layout" }),
    check("Hyperlinks", hasJsonMaster, ["Hyperlink validation requires JSON Master/export metadata."], { sourceComponent: "Export" }),
    check("PDF print", hasFormatExport(workspace.layoutPlan, "PDF") || hasFormatExport(workspace.layoutPlan, "PRINT_ON_DEMAND"), ["Print PDF export is missing."], { sourceComponent: "Export" }),
    check("EPUB", hasFormatExport(workspace.layoutPlan, "EPUB"), ["EPUB export is missing."], { sourceComponent: "Export" }),
    check("MOBI", hasFormatExport(workspace.layoutPlan, "MOBI"), ["MOBI export is missing."], { sourceComponent: "Export" }),
    check("JSON master", hasJsonMaster, ["JSON Master artifact is missing."], { sourceComponent: "Export" }),
    check("Audiobook", exported && !rightsBlocked, [exported ? "Audiobook rights/readiness need review." : "Final approved/exported text required for audiobook."], { fallbackStatus: "WARNING", severity: "WARNING", sourceComponent: "Publishing" }),
    check("Video", exported && !rightsBlocked, [exported ? "Video rights/readiness need review." : "Final approved/exported text required for video."], { fallbackStatus: "WARNING", severity: "WARNING", sourceComponent: "Publishing" }),
    check("Magazine flipbook", isMagazine && (hasFormatExport(workspace.layoutPlan, "PDF") || exported), [isMagazine ? "Magazine flipbook requires PDF/exported layout." : "Not a magazine issue/article."], { fallbackStatus: "WARNING", severity: "WARNING", sourceComponent: "Publishing" }),
    check("Final approval", approved && !rightsBlocked, [rightsBlocked ? "Rights blockers must be resolved." : "Human final approval is required."], { sourceComponent: "Workflow" })
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

  return [
    channel("Biblioteca internă", "INTERNAL_LIBRARY", workspace, ["Human layout approval", "Publishing rights"], [
      ...blockIf(!approved, "Human approval is required."),
      ...blockIf(rightsBlocked, "Rights blockers must be resolved."),
      ...blockIf(!hasJsonMasterAvailable(workspace), "JSON Master or Library publication reference is missing.")
    ]),
    channel("Portalul public", "PUBLIC_PORTAL", workspace, ["Human release approval", "Rights/provenance"], [
      ...blockIf(rightsBlocked, "Rights blockers must be resolved."),
      ...blockIf(workspace.publicCatalogItem?.releaseApprovalStatus !== "APPROVED", "Public portal release approval is missing.")
    ]),
    channel("Librăria digitală", "DIGITAL_BOOKSTORE", workspace, ["Human commercial approval", "Publishing rights"], [
      ...blockIf(!approved, "Human approval is required."),
      ...blockIf(!hasFormatExport(workspace.layoutPlan, "EPUB") && !hasFormatExport(workspace.layoutPlan, "MOBI"), "Digital bookstore requires EPUB or MOBI export.")
    ]),
    channel("Export extern", "EXTERNAL_EXPORT", workspace, ["Human export approval"], [
      ...blockIf(!approved, "Human approval is required."),
      ...blockIf(!hasJsonMasterAvailable(workspace), "External export requires JSON Master or approved export artifact.")
    ], "PDF"),
    channel("Print-on-Demand", "PRINT_ON_DEMAND", workspace, ["Human layout approval", "Publishing rights"], [
      ...blockIf(!approved, "Human approval is required."),
      ...blockIf(rightsBlocked, "Rights blockers must be resolved.")
    ], "PRINT_ON_DEMAND")
  ];
}

function check(
  label: string,
  ready: boolean,
  blockers: string[],
  options: {
    fallbackStatus?: PreflightStatus;
    remediationLink?: string;
    severity?: PreflightSeverity;
    sourceComponent?: PreflightSourceComponent;
  } = {}
): PreflightCheck {
  const fallbackStatus = options.fallbackStatus ?? "BLOCKED";

  return {
    blockers: ready ? [] : blockers,
    label,
    lastValidationTimestamp: new Date().toISOString(),
    message: ready ? `${label} passed.` : blockers.join("; "),
    officialStatus: ready ? "PASS" : fallbackStatus === "BLOCKED" ? "ERROR" : "WARNING",
    remediationLink: options.remediationLink ?? "/distribution",
    severity: ready ? "INFORMATIONAL" : options.severity ?? (fallbackStatus === "BLOCKED" ? "CRITICAL" : "WARNING"),
    sourceComponent: options.sourceComponent ?? "Publishing",
    status: ready ? "READY" : fallbackStatus
  };
}

function channel(
  name: DistributionChannelName,
  code: DistributionChannelCode,
  workspace: PublishingWorkspaceData,
  requiredApprovals: string[],
  blockers: string[],
  exportFormat?: string
): DistributionChannel {
  return {
    blockers,
    code,
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

function hasJsonMasterAvailable(workspace: PublishingWorkspaceData): boolean {
  return Boolean(workspace.artifact || workspace.selectedDocument?.status === "EXPORTED");
}

function calculateReadinessPercentage(checks: PreflightCheck[]): number {
  const passed = checks.filter((check) => check.officialStatus === "PASS" || check.officialStatus === "NOT_APPLICABLE").length;

  return Math.round((passed / checks.length) * 100);
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
