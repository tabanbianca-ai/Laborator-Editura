import type { ComponentProps } from "react";
import Link from "next/link";

import type {
  DistributionCenterData,
  DistributionChannel,
  PreflightCheck,
  PreflightStatus
} from "../../lib/distribution-center-client";
import type { ProjectOrigin, ProjectRightsStatus } from "../../lib/projects-documents-api";
import { createUiTranslator, type UiTranslationKey, type UiTranslator } from "../../lib/ui-i18n";
import { Badge, Card, EmptyState, ErrorState, PageHeader, Table } from "../ui";

type BadgeTone = ComponentProps<typeof Badge>["tone"];

export function DistributionCenterPage({
  data,
  platformLanguage
}: {
  data: DistributionCenterData;
  platformLanguage?: string | null;
}) {
  const { workspace } = data;
  const ui = createUiTranslator(platformLanguage);

  return (
    <main className="page-stack">
      <PageHeader
        eyebrow={ui.t("distribution.preflight")}
        title={ui.t("distribution.title")}
      />

      {workspace.projectsError ? <ErrorState message={workspace.projectsError} title={ui.t("error.projectsUnavailable")} /> : null}
      {workspace.documentsError ? <ErrorState message={workspace.documentsError} title={ui.t("error.documentsUnavailable")} /> : null}
      {workspace.workflowError ? <ErrorState message={workspace.workflowError} title={ui.t("error.workflowUnavailable")} /> : null}
      {workspace.rightsError ? <ErrorState message={workspace.rightsError} title={ui.t("error.rightsUnavailable")} /> : null}

      <DistributionOverview data={data} ui={ui} />
      <DocumentSelector data={data} ui={ui} />

      {!workspace.selectedDocument ? (
        <EmptyState
          description={ui.t("distribution.emptyDocumentDescription")}
          title={ui.t("distribution.emptyDocumentTitle")}
        />
      ) : (
        <>
          <section className="publishing-workspace-grid" aria-label={ui.t("distribution.finalGate")}>
            <PreflightValidationPanel checks={data.preflightChecks} ui={ui} />
            <PublicationGatePanel data={data} ui={ui} />
            <HumanAuthorityPanel ui={ui} />
          </section>

          <section className="content-panel">
            <div className="section-heading">
              <div>
                <p className="section-kicker">{ui.t("label.distributionCenter")}</p>
                <h2>{ui.t("distribution.publicationChannels")}</h2>
              </div>
              <Badge tone={data.blockedCount > 0 ? "warning" : "success"}>
                {data.blockedCount > 0 ? ui.t("distribution.blockersPresent") : ui.t("badge.ready")}
              </Badge>
            </div>
            <DistributionChannelTable channels={data.channels} ui={ui} />
          </section>

          <section className="content-panel">
            <div className="section-heading">
              <div>
                <p className="section-kicker">{ui.t("distribution.blockers")}</p>
                <h2>{ui.t("distribution.prePublicationBlockers")}</h2>
              </div>
              <Badge tone={data.blockedCount > 0 ? "warning" : "success"}>
                {data.blockedCount}
              </Badge>
            </div>
            <BlockerList checks={data.preflightChecks} channels={data.channels} ui={ui} />
          </section>
        </>
      )}
    </main>
  );
}

function DistributionOverview({ data, ui }: { data: DistributionCenterData; ui: UiTranslator }) {
  return (
    <section className="metric-grid" aria-label="Preflight overview">
      <Card>
        <div className="metric-card">
          <span>{ui.t("distribution.readyChecks")}</span>
          <strong>{data.readyCount}</strong>
          <Badge tone="success">READY</Badge>
        </div>
      </Card>
      <Card>
        <div className="metric-card">
          <span>{ui.t("distribution.warningCount")}</span>
          <strong>{data.warningCount}</strong>
          <Badge tone={data.warningCount > 0 ? "warning" : "success"}>WARNING</Badge>
        </div>
      </Card>
      <Card>
        <div className="metric-card">
          <span>{ui.t("pipeline.blocked")}</span>
          <strong>{data.blockedCount}</strong>
          <Badge tone={data.blockedCount > 0 ? "danger" : "success"}>BLOCKED</Badge>
        </div>
      </Card>
      <Card>
        <div className="metric-card">
          <span>{ui.t("distribution.channels")}</span>
          <strong>{data.channels.length}</strong>
          <Badge tone="info">{ui.t("badge.distribution")}</Badge>
        </div>
      </Card>
    </section>
  );
}

function DocumentSelector({ data, ui }: { data: DistributionCenterData; ui: UiTranslator }) {
  const { workspace } = data;

  return (
    <section className="translation-selector-grid" aria-label="Distribution document selection">
      <Card title={ui.t("distribution.project")}>
        <p className="selector-value">{workspace.selectedProject?.name ?? ui.t("distribution.notSelected")}</p>
        {workspace.selectedProject?.projectIdentity ? (
          <div className="reference-stack">
            <ReferenceItem
              label={ui.t("project.origin")}
              value={formatProjectOrigin(workspace.selectedProject.projectIdentity.projectOrigin, ui)}
            />
            <ReferenceItem
              label={ui.t("project.rightsStatus")}
              value={formatRightsStatus(workspace.selectedProject.projectIdentity.rightsStatus, ui)}
            />
          </div>
        ) : null}
      </Card>
      <Card title={ui.t("distribution.document")}>
        <p className="selector-value">{workspace.selectedDocument?.title ?? ui.t("distribution.notSelected")}</p>
        <div className="document-link-list">
          {workspace.documents.slice(0, 8).map((document) => (
            <Link
              className={
                workspace.selectedDocument?.id === document.id
                  ? "document-selector-link document-selector-link-active"
                  : "document-selector-link"
              }
              href={`/distribution?documentId=${encodeURIComponent(document.id)}`}
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

function PreflightValidationPanel({
  checks,
  ui
}: {
  checks: PreflightCheck[];
  ui: UiTranslator;
}) {
  return (
    <Card title={ui.t("distribution.preflightPanel")}>
      <div className="reference-stack">
        {checks.map((check) => (
          <div className="signal-row" key={check.label}>
            <span>{check.label}</span>
            <Badge tone={toneForPreflight(check.status)}>{check.status}</Badge>
          </div>
        ))}
      </div>
    </Card>
  );
}

function PublicationGatePanel({ data, ui }: { data: DistributionCenterData; ui: UiTranslator }) {
  return (
    <Card title={ui.t("distribution.publicationGate")}>
      <div className="reference-stack">
        <ReferenceItem
          label={ui.t("distribution.workflow")}
          value={data.workspace.workflow?.status?.replace(/_/g, " ") ?? ui.t("distribution.noWorkflowLinked")}
        />
        <ReferenceItem
          label={ui.t("distribution.rightsProvenance")}
          value={data.workspace.rightsWarnings.length > 0 ? ui.t("distribution.warningsPresent") : ui.t("distribution.noRightsWarnings")}
        />
        <ReferenceItem
          label={ui.t("distribution.jsonMaster")}
          value={data.workspace.artifact ? "Available" : "Missing"}
        />
        <button className="ui-button ui-button-primary ui-button-sm" disabled type="button">
          {ui.t("action.publish")}
        </button>
        <p className="pipeline-guidance">
          {ui.t("distribution.publishDisabled")}
        </p>
      </div>
    </Card>
  );
}

function HumanAuthorityPanel({ ui }: { ui: UiTranslator }) {
  return (
    <Card title={ui.t("pipeline.humanAuthority")}>
      <p className="review-human-authority">
        Preflight may identify blockers and distribution readiness, but it cannot approve, publish, bypass rights,
        or release content automatically.
      </p>
      <div className="reference-stack">
        <ReferenceItem label={ui.t("distribution.autoPublish")} value="Disabled" />
        <ReferenceItem label={ui.t("distribution.autoApprove")} value="Disabled" />
        <ReferenceItem label={ui.t("distribution.externalProviders")} value={ui.t("distribution.notConfigured")} />
      </div>
    </Card>
  );
}

function DistributionChannelTable({
  channels,
  ui
}: {
  channels: DistributionChannel[];
  ui: UiTranslator;
}) {
  return (
    <Table ariaLabel="Distribution channels">
      <thead>
        <tr>
          <th>{ui.t("distribution.channels")}</th>
          <th>Status</th>
          <th>{ui.t("distribution.requiredApprovals")}</th>
          <th>{ui.t("distribution.blockers")}</th>
          <th>{ui.t("distribution.lastExportDate")}</th>
          <th>{ui.t("distribution.publishReadiness")}</th>
        </tr>
      </thead>
      <tbody>
        {channels.map((channel) => (
          <tr key={channel.name}>
            <td>{channel.name}</td>
            <td>{channel.status}</td>
            <td>{channel.requiredApprovals.join(", ")}</td>
            <td>{channel.blockers.length > 0 ? channel.blockers.join("; ") : "None"}</td>
            <td>{channel.lastExportDate}</td>
            <td>
              <Badge tone={toneForPreflight(channel.publishReadiness)}>
                {channel.publishReadiness}
              </Badge>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

function BlockerList({
  channels,
  checks,
  ui
}: {
  channels: DistributionChannel[];
  checks: PreflightCheck[];
  ui: UiTranslator;
}) {
  const preflightBlockers = checks.flatMap((check) =>
    check.blockers.map((blocker) => `${check.label}: ${blocker}`)
  );
  const channelBlockers = channels.flatMap((channel) =>
    channel.blockers.map((blocker) => `${channel.name}: ${blocker}`)
  );
  const blockers = [...preflightBlockers, ...channelBlockers];

  if (blockers.length === 0) {
    return <EmptyState title={ui.t("distribution.emptyBlockers")} />;
  }

  return (
    <div className="stack-list">
      {blockers.map((blocker) => (
        <div className="blocking-warning" key={blocker} role="status">
          {blocker}
        </div>
      ))}
    </div>
  );
}

function ReferenceItem({
  label,
  value
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="reference-item">
      <strong>{label}</strong>
      <span>{value}</span>
    </div>
  );
}

function formatProjectOrigin(origin: ProjectOrigin, ui: UiTranslator): string {
  const labels: Record<ProjectOrigin, UiTranslationKey> = {
    AUDIO_VIDEO_PROJECT: "project.audioVideoProject",
    CHILDRENS_BOOK: "project.childrenBook",
    EDITORIAL_COLLABORATION: "project.editorialCollaboration",
    EXTERNAL_AUTHOR: "project.externalAuthor",
    MAGAZINE_ARTICLE: "project.magazineArticle",
    ORIGINAL_CREATION: "project.originalCreation",
    PUBLIC_DOMAIN_CLASSICAL_WORK: "project.publicDomainClassicalWork",
    TRANSLATION: "project.translation"
  };

  return ui.t(labels[origin]);
}

function formatRightsStatus(status: ProjectRightsStatus, ui: UiTranslator): string {
  const labels: Record<ProjectRightsStatus, UiTranslationKey> = {
    CLASSICAL_WORK: "project.classicalWork",
    OPEN_LICENSE: "project.openLicense",
    ORIGINAL_CREATION: "project.originalCreation",
    PUBLIC_DOMAIN: "project.publicDomain",
    RESTRICTED_PUBLICATION: "project.restrictedPublication",
    RIGHTS_OBTAINED: "project.rightsObtained",
    RIGHTS_PENDING: "project.rightsPending"
  };

  return ui.t(labels[status]);
}

function toneForPreflight(status: PreflightStatus): BadgeTone {
  if (status === "READY") {
    return "success";
  }

  if (status === "BLOCKED") {
    return "danger";
  }

  return "warning";
}
