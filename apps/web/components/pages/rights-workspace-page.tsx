import type { ComponentProps } from "react";
import Link from "next/link";
import {
  createProvenanceRecordAction,
  createPublishingRightsAction,
  createRightsContractAction,
  createTranslationRightsAction
} from "../../lib/rights-workspace-actions";
import type {
  CollaborationAgreementRecord,
  CollaborationAgreementStatus,
  CollaborationAgreementType,
  ProvenanceRecord,
  PublishingAuthorizationRecord,
  RightsAuditEventRecord,
  RightsWarning,
  RightsWorkspaceData,
  TranslationAuthorizationRecord
} from "../../lib/rights-workspace-client";
import { Badge, Button, Card, EmptyState, ErrorState, Input, PageHeader, Select, Table } from "../ui";

type BadgeTone = ComponentProps<typeof Badge>["tone"];

type RightsTab = "collaboration" | "translation" | "publishing" | "provenance" | "audit";

interface RightsWorkspacePageProps {
  activeTab: RightsTab;
  documentId?: string;
  error?: string;
  projectId?: string;
  workspace: RightsWorkspaceData;
}

const agreementTypeOptions: Array<{ label: string; value: CollaborationAgreementType }> = [
  { label: "Author", value: "AUTHOR" },
  { label: "Translator", value: "TRANSLATOR" },
  { label: "Editor", value: "EDITOR" },
  { label: "Designer", value: "DESIGNER" },
  { label: "Illustrator", value: "ILLUSTRATOR" },
  { label: "Audio narrator", value: "AUDIO_NARRATOR" },
  { label: "Collaborator", value: "COLLABORATOR" }
];

const agreementStatusOptions: Array<{ label: string; value: CollaborationAgreementStatus }> = [
  { label: "Draft", value: "DRAFT" },
  { label: "Sent", value: "SENT" },
  { label: "Accepted", value: "ACCEPTED" },
  { label: "Expired", value: "EXPIRED" },
  { label: "Terminated", value: "TERMINATED" }
];

const tabs: Array<{ label: string; value: RightsTab }> = [
  { label: "Collaboration", value: "collaboration" },
  { label: "Translation Rights", value: "translation" },
  { label: "Publishing Rights", value: "publishing" },
  { label: "Provenance", value: "provenance" },
  { label: "Audit", value: "audit" }
];

export function RightsWorkspacePage({
  activeTab,
  documentId,
  error,
  projectId,
  workspace
}: RightsWorkspacePageProps) {
  return (
    <main className="page-stack">
      <PageHeader eyebrow="Rights" title="Rights, provenance & collaboration foundation" />

      {error ? <ErrorState message={error} /> : null}
      {workspace.contractsError ? <ErrorState message={workspace.contractsError} /> : null}
      {workspace.translationRightsError ? <ErrorState message={workspace.translationRightsError} /> : null}
      {workspace.publishingRightsError ? <ErrorState message={workspace.publishingRightsError} /> : null}
      {workspace.provenanceError ? <ErrorState message={workspace.provenanceError} /> : null}
      {workspace.auditError ? <ErrorState message={workspace.auditError} /> : null}

      <RightsWarningBanner warnings={workspace.warnings} />
      <RightsDashboard workspace={workspace} />
      <RightsTabs activeTab={activeTab} documentId={documentId} projectId={projectId} />

      {activeTab === "collaboration" ? (
        <CollaborationTab agreements={workspace.contracts} documentId={documentId} projectId={projectId} />
      ) : null}
      {activeTab === "translation" ? (
        <TranslationRightsTab
          authorizations={workspace.translationRights}
          documentId={documentId}
          projectId={projectId}
        />
      ) : null}
      {activeTab === "publishing" ? (
        <PublishingRightsTab
          authorizations={workspace.publishingRights}
          documentId={documentId}
          projectId={projectId}
        />
      ) : null}
      {activeTab === "provenance" ? (
        <ProvenanceTab documentId={documentId} projectId={projectId} records={workspace.provenance} />
      ) : null}
      {activeTab === "audit" ? <AuditTab events={workspace.audit} /> : null}
    </main>
  );
}

function RightsWarningBanner({ warnings }: { warnings: RightsWarning[] }) {
  if (warnings.length === 0) {
    return null;
  }

  return (
    <section className="rights-warning-banner" aria-label="Rights warning">
      <strong>Translation or publication cannot continue until the required rights are available.</strong>
      <ul>
        {warnings.map((warning) => (
          <li key={warning.code}>{warning.message}</li>
        ))}
      </ul>
    </section>
  );
}

function RightsDashboard({ workspace }: { workspace: RightsWorkspaceData }) {
  return (
    <section className="metric-grid" aria-label="Rights overview">
      <Card>
        <div className="metric-card">
          <span>Agreements</span>
          <strong>{workspace.contracts.length}</strong>
          <Badge tone="info">Collaboration</Badge>
        </div>
      </Card>
      <Card>
        <div className="metric-card">
          <span>Translation rights</span>
          <strong>{workspace.translationRights.length}</strong>
          <Badge tone={workspace.warnings.some((item) => item.code.startsWith("TRANSLATION")) ? "danger" : "success"}>
            Rights
          </Badge>
        </div>
      </Card>
      <Card>
        <div className="metric-card">
          <span>Publishing rights</span>
          <strong>{workspace.publishingRights.length}</strong>
          <Badge tone={workspace.warnings.some((item) => item.code.startsWith("PUBLICATION")) ? "danger" : "success"}>
            Publication
          </Badge>
        </div>
      </Card>
      <Card>
        <div className="metric-card">
          <span>Provenance</span>
          <strong>{workspace.provenance.length}</strong>
          <Badge tone="neutral">Source</Badge>
        </div>
      </Card>
    </section>
  );
}

function RightsTabs({
  activeTab,
  documentId,
  projectId
}: {
  activeTab: RightsTab;
  documentId?: string;
  projectId?: string;
}) {
  return (
    <nav className="rights-tabs" role="tablist">
      {tabs.map((tab) => (
        <Link
          aria-selected={activeTab === tab.value}
          className={activeTab === tab.value ? "rights-tab rights-tab-active" : "rights-tab"}
          href={tabHref(tab.value, projectId, documentId)}
          key={tab.value}
          role="tab"
        >
          {tab.label}
        </Link>
      ))}
    </nav>
  );
}

function CollaborationTab({
  agreements,
  documentId,
  projectId
}: {
  agreements: CollaborationAgreementRecord[];
  documentId?: string;
  projectId?: string;
}) {
  return (
    <section className="rights-workspace-grid" aria-label="Collaboration agreements">
      <Card className="rights-panel-card" title="Agreement list">
        {agreements.length === 0 ? (
          <EmptyState title="No collaboration agreements" />
        ) : (
          <Table ariaLabel="Collaboration agreement list">
            <thead>
              <tr>
                <th>Collaborator</th>
                <th>Type</th>
                <th>Status</th>
                <th>Expiry</th>
              </tr>
            </thead>
            <tbody>
              {agreements.map((agreement) => (
                <tr key={agreement.id}>
                  <td>{agreement.collaboratorName}</td>
                  <td>{agreement.agreementType.replace(/_/g, " ")}</td>
                  <td>
                    <Badge tone={toneForAgreementStatus(agreement.status)}>{agreement.status}</Badge>
                  </td>
                  <td>{agreement.endDate ?? "Not recorded"}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card>
      <Card className="rights-panel-card" title="Create collaboration agreement">
        <form action={createRightsContractAction} className="rights-form">
          <HiddenScope documentId={documentId} projectId={projectId} />
          <Select label="Agreement type" name="agreementType" options={agreementTypeOptions} required />
          <Select label="Status" name="status" options={agreementStatusOptions} />
          <Input label="Collaborator name" name="collaboratorName" required />
          <Input label="Collaborator ID" name="collaboratorId" />
          <Input label="Start date" name="startDate" type="date" />
          <Input label="End date" name="endDate" type="date" />
          <Input label="Attached document file" name="attachedDocumentFileName" />
          <Input label="Attached document reference" name="attachedDocumentReference" />
          <Textarea label="Notes" name="notes" />
          <Button type="submit">Record agreement</Button>
        </form>
      </Card>
    </section>
  );
}

function TranslationRightsTab({
  authorizations,
  documentId,
  projectId
}: {
  authorizations: TranslationAuthorizationRecord[];
  documentId?: string;
  projectId?: string;
}) {
  return (
    <section className="rights-workspace-grid" aria-label="Translation rights">
      <Card className="rights-panel-card" title="Translation authorization">
        {authorizations.length === 0 ? (
          <EmptyState title="No translation authorization" />
        ) : (
          <div className="reference-stack">
            {authorizations.map((authorization) => (
              <RightsAuthorizationSummary key={authorization.id} authorization={authorization} />
            ))}
          </div>
        )}
      </Card>
      <Card className="rights-panel-card" title="Record translation rights">
        <form action={createTranslationRightsAction} className="rights-form">
          <HiddenScope documentId={documentId} projectId={projectId} />
          <Input label="Original author" name="originalAuthor" />
          <Input label="Rights holder" name="rightsHolder" />
          <Checkbox label="Translation authorized" name="translationAuthorized" />
          <Input label="Authorized languages" name="authorizedLanguages" placeholder="ro, es, fr" />
          <Input label="Territories" name="territories" placeholder="EU, US" />
          <Input label="Valid until" name="validUntil" type="date" />
          <Input label="Authorization document file" name="authorizationDocumentFileName" />
          <Input label="Authorization document reference" name="authorizationDocumentReference" />
          <Textarea label="Notes" name="notes" />
          <Button type="submit">Record translation rights</Button>
        </form>
      </Card>
    </section>
  );
}

function PublishingRightsTab({
  authorizations,
  documentId,
  projectId
}: {
  authorizations: PublishingAuthorizationRecord[];
  documentId?: string;
  projectId?: string;
}) {
  return (
    <section className="rights-workspace-grid" aria-label="Publishing rights">
      <Card className="rights-panel-card" title="Publishing authorization">
        {authorizations.length === 0 ? (
          <EmptyState title="No publishing authorization" />
        ) : (
          <div className="reference-stack">
            {authorizations.map((authorization) => (
              <PublishingAuthorizationSummary key={authorization.id} authorization={authorization} />
            ))}
          </div>
        )}
      </Card>
      <Card className="rights-panel-card" title="Record publishing rights">
        <form action={createPublishingRightsAction} className="rights-form">
          <HiddenScope documentId={documentId} projectId={projectId} />
          <Checkbox label="Publication authorized" name="publicationAuthorized" />
          <Checkbox label="Ebook allowed" name="ebookAllowed" />
          <Checkbox label="Print allowed" name="printAllowed" />
          <Checkbox label="PDF allowed" name="pdfAllowed" />
          <Checkbox label="MOBI allowed" name="mobiAllowed" />
          <Checkbox label="Audiobook allowed" name="audiobookAllowed" />
          <Checkbox label="Video allowed" name="videoAllowed" />
          <Checkbox label="Commercial distribution allowed" name="commercialDistributionAllowed" />
          <Textarea label="Notes" name="notes" />
          <Button type="submit">Record publishing rights</Button>
        </form>
      </Card>
    </section>
  );
}

function ProvenanceTab({
  documentId,
  projectId,
  records
}: {
  documentId?: string;
  projectId?: string;
  records: ProvenanceRecord[];
}) {
  return (
    <section className="rights-workspace-grid" aria-label="Provenance information">
      <Card className="rights-panel-card" title="Provenance information">
        {records.length === 0 ? (
          <EmptyState title="No provenance records" />
        ) : (
          <div className="reference-stack">
            {records.map((record) => (
              <ProvenanceSummary key={record.id} record={record} />
            ))}
          </div>
        )}
      </Card>
      <Card className="rights-panel-card" title="Record provenance">
        <form action={createProvenanceRecordAction} className="rights-form">
          <HiddenScope documentId={documentId} projectId={projectId} />
          <Input label="Original title" name="originalTitle" />
          <Input label="Original language" name="originalLanguage" />
          <Input label="First publication year" name="firstPublicationYear" type="number" />
          <Input label="Original edition" name="originalEdition" />
          <Input label="Original publisher" name="originalPublisher" />
          <Input label="Original source reference" name="originalSourceReference" />
          <Input label="Original author" name="originalAuthor" />
          <Input label="Translator" name="translator" />
          <Input label="Reviewer" name="reviewer" />
          <Input label="Publisher" name="publisher" />
          <Input label="Publication history" name="publicationHistory" placeholder="Original, translation, edition" />
          <Input label="Metadata reference" name="metadataReference" />
          <Button type="submit">Record provenance</Button>
        </form>
      </Card>
    </section>
  );
}

function AuditTab({ events }: { events: RightsAuditEventRecord[] }) {
  return (
    <Card title="Audit">
      {events.length === 0 ? (
        <EmptyState title="No rights audit events" />
      ) : (
        <Table ariaLabel="Rights audit events">
          <thead>
            <tr>
              <th>Action</th>
              <th>Actor</th>
              <th>Human authority</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr key={event.id}>
                <td>{event.action.replace(/_/g, " ")}</td>
                <td>{event.actorId}</td>
                <td>
                  <Badge tone="success">{String(event.humanFinalAuthorityRequired)}</Badge>
                </td>
                <td>{event.createdAt}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Card>
  );
}

function RightsAuthorizationSummary({ authorization }: { authorization: TranslationAuthorizationRecord }) {
  return (
    <article className="rights-summary-card">
      <div className="rights-summary-heading">
        <strong>{authorization.rightsHolder ?? "Rights holder not recorded"}</strong>
        <Badge tone={authorization.translationAuthorized ? "success" : "danger"}>
          {authorization.translationAuthorized ? "AUTHORIZED" : "NOT_AUTHORIZED"}
        </Badge>
      </div>
      <dl className="rights-detail-grid">
        <Detail label="Original author" value={authorization.originalAuthor ?? "Not recorded"} />
        <Detail label="Rights holder" value={authorization.rightsHolder ?? "Not recorded"} />
        <Detail label="Authorized languages" value={formatList(authorization.authorizedLanguages)} />
        <Detail label="Territories" value={formatList(authorization.territories)} />
        <Detail label="Expiry" value={authorization.validUntil ?? "Not recorded"} />
      </dl>
    </article>
  );
}

function PublishingAuthorizationSummary({ authorization }: { authorization: PublishingAuthorizationRecord }) {
  return (
    <article className="rights-summary-card">
      <div className="rights-summary-heading">
        <strong>Publishing rights</strong>
        <Badge tone={authorization.publicationAuthorized ? "success" : "danger"}>
          {authorization.publicationAuthorized ? "AUTHORIZED" : "NOT_AUTHORIZED"}
        </Badge>
      </div>
      <dl className="rights-detail-grid">
        <Detail label="Ebook" value={formatBoolean(authorization.ebookAllowed)} />
        <Detail label="Print" value={formatBoolean(authorization.printAllowed)} />
        <Detail label="PDF" value={formatBoolean(authorization.pdfAllowed)} />
        <Detail label="MOBI" value={formatBoolean(authorization.mobiAllowed)} />
        <Detail label="Audiobook" value={formatBoolean(authorization.audiobookAllowed)} />
        <Detail label="Video" value={formatBoolean(authorization.videoAllowed)} />
        <Detail label="Commercial distribution" value={formatBoolean(authorization.commercialDistributionAllowed)} />
      </dl>
    </article>
  );
}

function ProvenanceSummary({ record }: { record: ProvenanceRecord }) {
  return (
    <article className="rights-summary-card">
      <div className="rights-summary-heading">
        <strong>{record.originalTitle ?? "Original title not recorded"}</strong>
        <Badge tone="info">{record.originalLanguage ?? "NO_LANGUAGE"}</Badge>
      </div>
      <dl className="rights-detail-grid">
        <Detail label="Original author" value={record.originalAuthor ?? "Not recorded"} />
        <Detail label="Translator" value={record.translator ?? "Not recorded"} />
        <Detail label="Reviewer" value={record.reviewer ?? "Not recorded"} />
        <Detail label="Rights holder" value={record.publisher ?? "Publication metadata pending"} />
        <Detail label="Original edition" value={record.originalEdition ?? "Not recorded"} />
        <Detail label="Original language" value={record.originalLanguage ?? "Not recorded"} />
        <Detail label="First publication year" value={record.firstPublicationYear?.toString() ?? "Not recorded"} />
        <Detail label="Original source" value={record.originalSourceReference ?? "Not recorded"} />
      </dl>
      <p className="review-human-authority">
        Human Final Authority: provenance is preserved as editorial metadata and is never modified automatically.
      </p>
    </article>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

function HiddenScope({ documentId, projectId }: { documentId?: string; projectId?: string }) {
  return (
    <>
      <input name="projectId" type="hidden" value={projectId ?? ""} />
      <input name="documentId" type="hidden" value={documentId ?? ""} />
    </>
  );
}

function Textarea({ label, name }: { label: string; name: string }) {
  return (
    <label className="ui-input-field">
      <span>{label}</span>
      <textarea className="ui-input rights-textarea" name={name} rows={4} />
    </label>
  );
}

function Checkbox({ label, name }: { label: string; name: string }) {
  return (
    <label className="rights-checkbox">
      <input name={name} type="checkbox" />
      <span>{label}</span>
    </label>
  );
}

function tabHref(tab: RightsTab, projectId?: string, documentId?: string): string {
  const query = new URLSearchParams({ tab });

  if (projectId) {
    query.set("projectId", projectId);
  }

  if (documentId) {
    query.set("documentId", documentId);
  }

  return `/rights?${query.toString()}`;
}

function toneForAgreementStatus(status: CollaborationAgreementStatus): BadgeTone {
  if (status === "ACCEPTED") {
    return "success";
  }

  if (status === "EXPIRED" || status === "TERMINATED") {
    return "danger";
  }

  if (status === "SENT") {
    return "warning";
  }

  return "neutral";
}

function formatList(value: string[]): string {
  return value.length > 0 ? value.join(", ") : "Not recorded";
}

function formatBoolean(value: boolean): string {
  return value ? "Allowed" : "Not allowed";
}
