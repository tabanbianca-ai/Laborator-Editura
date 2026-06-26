import type { ComponentProps } from "react";
import Link from "next/link";

import type {
  DistributionCenterData,
  DistributionChannel,
  PreflightCheck,
  PreflightStatus
} from "../../lib/distribution-center-client";
import { Badge, Card, EmptyState, ErrorState, PageHeader, Table } from "../ui";

type BadgeTone = ComponentProps<typeof Badge>["tone"];

export function DistributionCenterPage({
  data
}: {
  data: DistributionCenterData;
}) {
  const { workspace } = data;

  return (
    <main className="page-stack">
      <PageHeader
        eyebrow="Preflight"
        title="Preflight & Distribution Center"
      />

      {workspace.projectsError ? <ErrorState message={workspace.projectsError} title="Projects unavailable" /> : null}
      {workspace.documentsError ? <ErrorState message={workspace.documentsError} title="Documents unavailable" /> : null}
      {workspace.workflowError ? <ErrorState message={workspace.workflowError} title="Workflow unavailable" /> : null}
      {workspace.rightsError ? <ErrorState message={workspace.rightsError} title="Rights unavailable" /> : null}

      <DistributionOverview data={data} />
      <DocumentSelector data={data} />

      {!workspace.selectedDocument ? (
        <EmptyState
          description="Select a document from the list to run the final production gate."
          title="No document selected for preflight"
        />
      ) : (
        <>
          <section className="publishing-workspace-grid" aria-label="Final production gate">
            <PreflightValidationPanel checks={data.preflightChecks} />
            <PublicationGatePanel data={data} />
            <HumanAuthorityPanel />
          </section>

          <section className="content-panel">
            <div className="section-heading">
              <div>
                <p className="section-kicker">Distribution Center</p>
                <h2>Publication channels</h2>
              </div>
              <Badge tone={data.blockedCount > 0 ? "warning" : "success"}>
                {data.blockedCount > 0 ? "Blockers present" : "Ready"}
              </Badge>
            </div>
            <DistributionChannelTable channels={data.channels} />
          </section>

          <section className="content-panel">
            <div className="section-heading">
              <div>
                <p className="section-kicker">Blockers</p>
                <h2>Pre-publication blockers</h2>
              </div>
              <Badge tone={data.blockedCount > 0 ? "warning" : "success"}>
                {data.blockedCount}
              </Badge>
            </div>
            <BlockerList checks={data.preflightChecks} channels={data.channels} />
          </section>
        </>
      )}
    </main>
  );
}

function DistributionOverview({ data }: { data: DistributionCenterData }) {
  return (
    <section className="metric-grid" aria-label="Preflight overview">
      <Card>
        <div className="metric-card">
          <span>Ready checks</span>
          <strong>{data.readyCount}</strong>
          <Badge tone="success">READY</Badge>
        </div>
      </Card>
      <Card>
        <div className="metric-card">
          <span>Warnings</span>
          <strong>{data.warningCount}</strong>
          <Badge tone={data.warningCount > 0 ? "warning" : "success"}>WARNING</Badge>
        </div>
      </Card>
      <Card>
        <div className="metric-card">
          <span>Blocked</span>
          <strong>{data.blockedCount}</strong>
          <Badge tone={data.blockedCount > 0 ? "danger" : "success"}>BLOCKED</Badge>
        </div>
      </Card>
      <Card>
        <div className="metric-card">
          <span>Channels</span>
          <strong>{data.channels.length}</strong>
          <Badge tone="info">Distribution</Badge>
        </div>
      </Card>
    </section>
  );
}

function DocumentSelector({ data }: { data: DistributionCenterData }) {
  const { workspace } = data;

  return (
    <section className="translation-selector-grid" aria-label="Distribution document selection">
      <Card title="Project">
        <p className="selector-value">{workspace.selectedProject?.name ?? "Not selected"}</p>
      </Card>
      <Card title="Document">
        <p className="selector-value">{workspace.selectedDocument?.title ?? "Not selected"}</p>
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

function PreflightValidationPanel({ checks }: { checks: PreflightCheck[] }) {
  return (
    <Card title="Preflight validation panel">
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

function PublicationGatePanel({ data }: { data: DistributionCenterData }) {
  return (
    <Card title="Publication gate">
      <div className="reference-stack">
        <ReferenceItem
          label="Workflow"
          value={data.workspace.workflow?.status?.replace(/_/g, " ") ?? "No workflow linked"}
        />
        <ReferenceItem
          label="Rights/provenance"
          value={data.workspace.rightsWarnings.length > 0 ? "Warnings present" : "No rights warnings"}
        />
        <ReferenceItem
          label="JSON master"
          value={data.workspace.artifact ? "Available" : "Missing"}
        />
        <button className="ui-button ui-button-primary ui-button-sm" disabled type="button">
          Publish
        </button>
        <p className="pipeline-guidance">
          Publication is disabled here until authorized humans confirm all gates. No billing or external distribution provider is connected.
        </p>
      </div>
    </Card>
  );
}

function HumanAuthorityPanel() {
  return (
    <Card title="Human Final Authority">
      <p className="review-human-authority">
        Preflight may identify blockers and distribution readiness, but it cannot approve, publish, bypass rights,
        or release content automatically.
      </p>
      <div className="reference-stack">
        <ReferenceItem label="Auto-publish" value="Disabled" />
        <ReferenceItem label="Auto-approve" value="Disabled" />
        <ReferenceItem label="External providers" value="Not configured" />
      </div>
    </Card>
  );
}

function DistributionChannelTable({ channels }: { channels: DistributionChannel[] }) {
  return (
    <Table ariaLabel="Distribution channels">
      <thead>
        <tr>
          <th>Channel</th>
          <th>Status</th>
          <th>Required approvals</th>
          <th>Blockers</th>
          <th>Last export date</th>
          <th>Publish readiness</th>
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
  checks
}: {
  channels: DistributionChannel[];
  checks: PreflightCheck[];
}) {
  const preflightBlockers = checks.flatMap((check) =>
    check.blockers.map((blocker) => `${check.label}: ${blocker}`)
  );
  const channelBlockers = channels.flatMap((channel) =>
    channel.blockers.map((blocker) => `${channel.name}: ${blocker}`)
  );
  const blockers = [...preflightBlockers, ...channelBlockers];

  if (blockers.length === 0) {
    return <EmptyState title="No pre-publication blockers" />;
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

function toneForPreflight(status: PreflightStatus): BadgeTone {
  if (status === "READY") {
    return "success";
  }

  if (status === "BLOCKED") {
    return "danger";
  }

  return "warning";
}
