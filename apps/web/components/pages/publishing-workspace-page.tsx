import type { ComponentProps } from "react";
import Link from "next/link";
import {
  approveLayoutPublicationAction,
  createPublishingExportAction,
  recordLayoutExportAction
} from "../../lib/publishing-workspace-actions";
import type {
  LayoutPublicationPlanRecord,
  PublishingExportFormat,
  PublishingWorkspaceData
} from "../../lib/publishing-workspace-client";
import type { WorkspaceTranslationRecord } from "../../lib/translation-workspace-client";
import { Badge, Button, Card, EmptyState, ErrorState, PageHeader, Table } from "../ui";

type BadgeTone = ComponentProps<typeof Badge>["tone"];

interface PublishingWorkspacePageProps {
  error?: string;
  workspace: PublishingWorkspaceData;
}

const formatCards: Array<{
  format: PublishingExportFormat;
  label: string;
}> = [
  { format: "PDF", label: "PDF" },
  { format: "EPUB", label: "EPUB" },
  { format: "MOBI", label: "MOBI" },
  { format: "PRINT_ON_DEMAND", label: "PRINT" }
];

export function PublishingWorkspacePage({
  error,
  workspace
}: PublishingWorkspacePageProps) {
  return (
    <main className="page-stack">
      <PageHeader eyebrow="Publishing" title="Publishing & export workspace" />

      {error ? <ErrorState message={error} /> : null}
      {workspace.projectsError ? <ErrorState message={workspace.projectsError} /> : null}
      {workspace.documentsError ? <ErrorState message={workspace.documentsError} /> : null}
      {workspace.translationsError ? <ErrorState message={workspace.translationsError} /> : null}
      {workspace.workflowError ? <ErrorState message={workspace.workflowError} /> : null}
      {workspace.rightsError ? <ErrorState message={workspace.rightsError} /> : null}

      <PublicationDashboard workspace={workspace} />
      <DocumentSelector workspace={workspace} />

      {!workspace.selectedDocument ? (
        <EmptyState title="No document selected" />
      ) : (
        <>
          <section className="publishing-workspace-grid" aria-label="Publishing preparation">
            <PublishingReadinessPanel workspace={workspace} />
            <FormatCards workspace={workspace} />
            <AttributionPanel workspace={workspace} />
          </section>

          <section className="publishing-workspace-grid publishing-workspace-grid-wide" aria-label="Publication status">
            <LayoutPlanPanel workspace={workspace} />
            <ExportHistoryPanel workspace={workspace} />
          </section>

          <section className="publishing-workspace-grid" aria-label="Public release and commerce status">
            <PublicPortalPanel workspace={workspace} />
            <CommercePanel workspace={workspace} />
            <OriginalSourcePanel workspace={workspace} />
          </section>
        </>
      )}
    </main>
  );
}

function PublicationDashboard({ workspace }: { workspace: PublishingWorkspaceData }) {
  return (
    <section className="metric-grid" aria-label="Publication export dashboard">
      <Card>
        <div className="metric-card">
          <span>Workflow</span>
          <strong>{workspace.workflow?.status?.replace(/_/g, " ") ?? "Pending"}</strong>
          <Badge tone={toneForWorkflow(workspace.workflow?.status)}>
            {workspace.workflow?.status ?? "NO_WORKFLOW"}
          </Badge>
        </div>
      </Card>
      <Card>
        <div className="metric-card">
          <span>Layout approval</span>
          <strong>{workspace.layoutPlan?.approvalStatus?.replace(/_/g, " ") ?? "No plan"}</strong>
          <Badge tone={toneForApproval(workspace.layoutPlan?.approvalStatus)}>
            {workspace.layoutPlan?.approvalStatus ?? "NOT_LINKED"}
          </Badge>
        </div>
      </Card>
      <Card>
        <div className="metric-card">
          <span>Public release</span>
          <strong>{workspace.publicCatalogItem?.availabilityStatus?.replace(/_/g, " ") ?? "Not linked"}</strong>
          <Badge tone={toneForPublicRelease(workspace.publicCatalogItem?.releaseApprovalStatus)}>
            {workspace.publicCatalogItem?.releaseApprovalStatus ?? "PENDING"}
          </Badge>
        </div>
      </Card>
      <Card>
        <div className="metric-card">
          <span>Commerce</span>
          <strong>{workspace.commerceEdition?.availabilityStatus?.replace(/_/g, " ") ?? "Not linked"}</strong>
          <Badge tone={toneForCommerce(workspace.commerceEdition?.approvalStatus)}>
            {workspace.commerceEdition?.approvalStatus ?? "PENDING"}
          </Badge>
        </div>
      </Card>
    </section>
  );
}

function DocumentSelector({ workspace }: { workspace: PublishingWorkspaceData }) {
  return (
    <section className="translation-selector-grid" aria-label="Publishing document selection">
      <Card title="Project">
        <p className="selector-value">
          {workspace.selectedProject?.name ?? "Not selected"}
        </p>
        <select className="ui-input ui-select" disabled name="publishing-project-selector">
          <option>
            {workspace.selectedProject?.name ?? "Project selector"}
          </option>
        </select>
      </Card>
      <Card title="Document">
        <p className="selector-value">
          {workspace.selectedDocument?.title ?? "Not selected"}
        </p>
        <div className="document-link-list">
          {workspace.documents.slice(0, 6).map((document) => (
            <Link
              className={
                workspace.selectedDocument?.id === document.id
                  ? "document-selector-link document-selector-link-active"
                  : "document-selector-link"
              }
              href={`/publishing?documentId=${encodeURIComponent(document.id)}`}
              key={document.id}
            >
              {document.title}
            </Link>
          ))}
        </div>
      </Card>
    </section>
  );
}

function PublishingReadinessPanel({ workspace }: { workspace: PublishingWorkspaceData }) {
  const canCreateJsonMaster = Boolean(workspace.selectedDocument && workspace.selectedProject);

  return (
    <Card title="Publication readiness">
      <div className="reference-stack">
        <ReferenceItem
          label="Document status"
          text={workspace.selectedDocument?.status.replace(/_/g, " ") ?? "Not selected"}
        />
        <ReferenceItem
          label="Workflow gate"
          text={workspace.workflow?.status?.replace(/_/g, " ") ?? "No active workflow status"}
        />
        <ReferenceItem
          label="Human approval"
          text={workspace.layoutPlan?.approvedBy ?? workspace.workflow?.approvedBy ?? "Required before release"}
        />
        {workspace.rightsWarnings.length > 0 ? (
          <div className="rights-warning-banner rights-warning-banner-compact">
            <strong>Translation or publication cannot continue until the required rights are available.</strong>
            <ul>
              {workspace.rightsWarnings.map((warning) => (
                <li key={warning.code}>{warning.message}</li>
              ))}
            </ul>
          </div>
        ) : (
          <ReferenceItem label="Rights gate" text="No missing rights warnings recorded" />
        )}
        <form action={createPublishingExportAction} className="publishing-action-form">
          <input name="documentId" type="hidden" value={workspace.selectedDocument?.id ?? ""} />
          <input name="projectId" type="hidden" value={workspace.selectedProject?.id ?? ""} />
          <Button disabled={!canCreateJsonMaster} type="submit">Create JSON Master export</Button>
        </form>
      </div>
    </Card>
  );
}

function FormatCards({ workspace }: { workspace: PublishingWorkspaceData }) {
  const hasPlan = Boolean(workspace.layoutPlan);

  return (
    <Card title="Format cards">
      <div className="publishing-format-grid">
        {formatCards.map((card) => (
          <article className="publishing-format-card" key={card.format}>
            <div>
              <strong>{card.label}</strong>
              <Badge tone={hasPlan ? "info" : "neutral"}>
                {hasPlan ? "Record supported" : "Plan required"}
              </Badge>
            </div>
            <form action={recordLayoutExportAction} className="publishing-action-form">
              <input name="documentId" type="hidden" value={workspace.selectedDocument?.id ?? ""} />
              <input name="layoutPlanId" type="hidden" value={workspace.layoutPlan?.id ?? ""} />
              <input name="format" type="hidden" value={card.format} />
              <Button disabled={!hasPlan} size="sm" type="submit" variant="secondary">
                Record export
              </Button>
            </form>
          </article>
        ))}
      </div>
    </Card>
  );
}

function AttributionPanel({ workspace }: { workspace: PublishingWorkspaceData }) {
  const translators = collectTranslatorAttribution(workspace.translations, workspace.artifact);
  const originalAuthor =
    workspace.latestTranslation?.originalAuthorName ??
    workspace.artifact?.metadata?.translatorAttribution?.find((item) => item.originalAuthorName)?.originalAuthorName ??
    "Preserved";

  return (
    <Card title="Attribution">
      <dl className="translation-attribution">
        <div>
          <dt>Author</dt>
          <dd>{originalAuthor}</dd>
        </div>
        <div>
          <dt>Translator</dt>
          <dd>{translators.length > 0 ? translators.join(", ") : "Not recorded"}</dd>
        </div>
        <div>
          <dt>Source language</dt>
          <dd>{workspace.selectedDocument?.sourceLanguage.toUpperCase() ?? "N/A"}</dd>
        </div>
        <div>
          <dt>Target language</dt>
          <dd>{workspace.selectedDocument?.targetLanguage.toUpperCase() ?? "N/A"}</dd>
        </div>
      </dl>
      <p className="review-human-authority">
        Human Final Authority: publication approvals remain controlled by authorized humans.
      </p>
    </Card>
  );
}

function LayoutPlanPanel({ workspace }: { workspace: PublishingWorkspaceData }) {
  const plan = workspace.layoutPlan;
  const canApprove = plan?.approvalStatus === "PENDING_HUMAN_APPROVAL";

  return (
    <Card title="Layout publication plan list">
      {workspace.layoutPlanError ? <ErrorState message={workspace.layoutPlanError} /> : null}
      {!plan ? (
        <EmptyState
          description="No layout plan is selected. Add layoutPlanId in the page URL when a plan already exists."
          title="No layout plan linked"
        />
      ) : (
        <div className="reference-stack">
          <ReferenceItem label={plan.title} text={`${plan.publicationKind} · ${plan.language.toUpperCase()}`} />
          <ReferenceItem label="Version" text={`Layout ${plan.layoutVersion}, style ${plan.styleRevision}`} />
          <ReferenceItem label="Status" text={plan.approvalStatus.replace(/_/g, " ")} />
          <ReferenceItem
            label="Print profile metadata"
            text={describePrintMetadata(plan)}
          />
          <form action={approveLayoutPublicationAction} className="publishing-action-form">
            <input name="documentId" type="hidden" value={workspace.selectedDocument?.id ?? ""} />
            <input name="layoutPlanId" type="hidden" value={plan.id} />
            <Button disabled={!canApprove} type="submit">Approve publication</Button>
          </form>
        </div>
      )}
    </Card>
  );
}

function ExportHistoryPanel({ workspace }: { workspace: PublishingWorkspaceData }) {
  const exportHistory = workspace.layoutPlan?.exportHistory ?? [];

  return (
    <Card title="Export history">
      {workspace.artifactError ? <ErrorState message={workspace.artifactError} /> : null}
      {exportHistory.length === 0 && !workspace.artifact ? (
        <EmptyState title="No export history" />
      ) : null}
      {exportHistory.length > 0 ? (
        <Table ariaLabel="Layout export history">
          <thead>
            <tr>
              <th>Format</th>
              <th>Artifact</th>
              <th>Created by</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {exportHistory.map((event) => (
              <tr key={event.id}>
                <td>{event.format.replace(/_/g, " ")}</td>
                <td>{event.artifactUri ?? "Metadata record"}</td>
                <td>{event.createdBy}</td>
                <td>{event.createdAt}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : null}
      {workspace.artifact ? (
        <div className="reference-stack">
          <ReferenceItem label="JSON Master artifact" text={workspace.artifact.id} />
          <ReferenceItem label="Created" text={workspace.artifact.createdAt} />
        </div>
      ) : null}
    </Card>
  );
}

function PublicPortalPanel({ workspace }: { workspace: PublishingWorkspaceData }) {
  const item = workspace.publicCatalogItem;

  return (
    <Card title="Public portal release status">
      {workspace.publicCatalogItemError ? <ErrorState message={workspace.publicCatalogItemError} /> : null}
      {!item ? (
        <EmptyState title="No public portal item linked" />
      ) : (
        <div className="reference-stack">
          <ReferenceItem label={item.metadata.title} text={item.availabilityStatus.replace(/_/g, " ")} />
          <ReferenceItem label="Release approval" text={item.releaseApprovalStatus.replace(/_/g, " ")} />
          <ReferenceItem
            label="Original source"
            text={item.metadata.originalSourceReferences.join(", ") || "Preserved in metadata"}
          />
        </div>
      )}
    </Card>
  );
}

function CommercePanel({ workspace }: { workspace: PublishingWorkspaceData }) {
  const edition = workspace.commerceEdition;

  return (
    <Card title="Commerce availability status">
      {workspace.commerceEditionError ? <ErrorState message={workspace.commerceEditionError} /> : null}
      {!edition ? (
        <EmptyState title="No commerce edition linked" />
      ) : (
        <div className="reference-stack">
          <ReferenceItem label={edition.title} text={edition.availabilityStatus.replace(/_/g, " ")} />
          <ReferenceItem label="Edition" text={`${edition.editionType} · ${edition.language.toUpperCase()}`} />
          <ReferenceItem
            label="Print profile"
            text={`${edition.printProfile.region} ${edition.printProfile.trimSize}, bleed ${edition.printProfile.bleed ?? "N/A"}`}
          />
          <ReferenceItem
            label="Commerce"
            text={`${edition.pricing.price ?? "No price"} ${edition.pricing.currency ?? ""} · stock ${edition.pricing.stock ?? "N/A"}`}
          />
        </div>
      )}
    </Card>
  );
}

function OriginalSourcePanel({ workspace }: { workspace: PublishingWorkspaceData }) {
  return (
    <Card title="Original source metadata">
      <div className="reference-stack">
        <ReferenceItem
          label="Project"
          text={workspace.selectedProject?.name ?? "Not selected"}
        />
        <ReferenceItem
          label="Original language"
          text={workspace.selectedProject?.sourceLanguage.toUpperCase() ?? workspace.selectedDocument?.sourceLanguage.toUpperCase() ?? "N/A"}
        />
        <ReferenceItem
          label="Document type"
          text={workspace.selectedDocument?.documentType ?? "N/A"}
        />
        <ReferenceItem
          label="Original source link"
          text={workspace.publicCatalogItem?.metadata.originalSourceReferences.join(", ") || "Linked through project/document metadata"}
        />
      </div>
    </Card>
  );
}

function ReferenceItem({ label, text }: { label: string; text: string }) {
  return (
    <div className="reference-item">
      <strong>{label}</strong>
      <span>{text}</span>
    </div>
  );
}

function collectTranslatorAttribution(
  translations: WorkspaceTranslationRecord[],
  artifact: PublishingWorkspaceData["artifact"]
): string[] {
  const names = new Set<string>();

  for (const translation of translations) {
    const label = translation.translatorName ?? translation.translatorId ?? translation.createdBy;

    if (label) {
      names.add(label);
    }
  }

  for (const attribution of artifact?.metadata?.translatorAttribution ?? []) {
    const label = attribution.translatorName ?? attribution.translatorId;

    if (label) {
      names.add(label);
    }
  }

  return [...names];
}

function describePrintMetadata(plan: LayoutPublicationPlanRecord): string {
  const profiles = plan.editorialFinishing.printProfiles.join(", ") || "No print profile";

  return `${profiles}; margins ${plan.editorialFinishing.margins}; bleed ${plan.editorialFinishing.bleed}`;
}

function toneForWorkflow(status: string | undefined): BadgeTone {
  if (status === "READY_FOR_EXPORT" || status === "EXPORTED" || status === "APPROVED") {
    return "success";
  }

  if (status === "BLOCKED") {
    return "danger";
  }

  if (status) {
    return "warning";
  }

  return "neutral";
}

function toneForApproval(status: string | undefined): BadgeTone {
  if (status === "APPROVED") {
    return "success";
  }

  if (status === "REJECTED") {
    return "danger";
  }

  if (status === "PENDING_HUMAN_APPROVAL") {
    return "warning";
  }

  return "neutral";
}

function toneForPublicRelease(status: string | undefined): BadgeTone {
  return toneForApproval(status);
}

function toneForCommerce(status: string | undefined): BadgeTone {
  return toneForApproval(status);
}
