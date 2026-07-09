import Link from "next/link";
import {
  assignProjectDossierItemAction,
  createProjectDossierAction
} from "../../lib/projects-actions";
import type {
  DocumentRecord,
  ProjectCapability,
  ProjectDossierItemRecord,
  ProjectDossierOverview,
  ProjectDossierRecord,
  ProjectPublicationType,
  ProjectRecord
} from "../../lib/projects-documents-api";
import { createUiTranslator, type UiTranslator } from "../../lib/ui-i18n";
import { Badge, Button, Card, EmptyState, ErrorState, Input, PageHeader, Select } from "../ui";

interface ProjectDetailPageProps {
  dossierError?: string;
  assignError?: string;
  documents: DocumentRecord[];
  documentsError: string | null;
  dossiers: ProjectDossierOverview | null;
  dossiersError: string | null;
  platformLanguage?: string | null;
  project: ProjectRecord | null;
  projectError: string | null;
}

export function ProjectDetailPage({
  assignError,
  dossierError,
  documents,
  documentsError,
  dossiers,
  dossiersError,
  platformLanguage,
  project,
  projectError
}: ProjectDetailPageProps) {
  const ui = createUiTranslator(platformLanguage);

  if (projectError || !project) {
    return (
      <main className="page-stack">
        <PageHeader eyebrow={ui.t("label.myProjects")} title={ui.t("dossier.projectDetail")} />
        <ErrorState message={projectError ?? ui.t("error.projectsUnavailable")} />
      </main>
    );
  }

  const dossierList = dossiers?.dossiers ?? [];
  const dossierItems = dossiers?.items ?? [];

  return (
    <main className="page-stack">
      <PageHeader
        actions={
          <Link className="ui-button ui-button-secondary ui-button-md" href="/projects">
            {ui.t("action.backToProjects")}
          </Link>
        }
        eyebrow={ui.t("dossier.projectDetail")}
        title={project.name}
      />

      {dossierError ? <ErrorState message={dossierError} /> : null}
      {assignError ? <ErrorState message={assignError} /> : null}
      {documentsError ? <ErrorState message={documentsError} title={ui.t("error.documentsUnavailable")} /> : null}
      {dossiersError ? <ErrorState message={dossiersError} title={ui.t("label.projectDossiers")} /> : null}

      <section className="translation-selector-grid" aria-label="Project metadata">
        <Card title={ui.t("label.projectIdentity")}>
          <div className="reference-stack">
            <ReferenceItem label={ui.t("project.origin")} value={formatEnum(project.projectIdentity?.projectOrigin, ui)} />
            <ReferenceItem label={ui.t("project.rightsStatus")} value={formatEnum(project.projectIdentity?.rightsStatus, ui)} />
            <ReferenceItem
              label={ui.t("project.originalAuthor")}
              value={project.projectIdentity?.originalAuthor?.name ?? ui.t("project.unassigned")}
            />
            <ReferenceItem label={ui.t("project.publicationType")} value={formatPublicationType(project.publicationType, ui)} />
            <ReferenceItem label={ui.t("project.capabilities")} value={formatCapabilities(project.capabilities, ui)} />
            <ReferenceItem label={ui.t("project.editorialProcess")} value={formatEditorialProcess(project.editorialProcess, ui)} />
          </div>
        </Card>
        <Card title={ui.t("label.projectDossiers")}>
          <div className="metric-card">
            <span>{ui.t("dossier.contains")}</span>
            <strong>{dossierList.length}</strong>
            <Badge tone="info">{ui.t("label.projectDossiers")}</Badge>
          </div>
        </Card>
      </section>

      <section className="content-panel">
        <div className="section-heading">
          <div>
            <p className="section-kicker">{ui.t("label.projectDossiers")}</p>
            <h2>{ui.t("dossier.groupedItems")}</h2>
          </div>
          <Badge tone="info">{dossierItems.length} {ui.t("dossier.assets").toLowerCase()}</Badge>
        </div>

        {dossierList.length === 0 ? <EmptyState title={ui.t("label.projectDossiers")} /> : null}
        {dossierList.length > 0 ? (
          <div className="dashboard-widget-grid">
            {topLevelDossiers(dossierList).map((dossier) => (
              <DossierCard
                documents={documents}
                dossier={dossier}
                dossiers={dossierList}
                items={dossierItems}
                key={dossier.id}
                projectId={project.id}
                ui={ui}
              />
            ))}
          </div>
        ) : null}
      </section>

      <section className="publishing-workspace-grid">
        <CreateDossierCard projectId={project.id} ui={ui} />
        <CreateSubDossierCard dossiers={dossierList} projectId={project.id} ui={ui} />
        <AssignDocumentCard
          documents={documents}
          dossiers={dossierList}
          items={dossierItems}
          projectId={project.id}
          ui={ui}
        />
      </section>
    </main>
  );
}

function DossierCard({
  documents,
  dossier,
  dossiers,
  items,
  projectId,
  ui
}: {
  documents: DocumentRecord[];
  dossier: ProjectDossierRecord;
  dossiers: ProjectDossierRecord[];
  items: ProjectDossierItemRecord[];
  projectId: string;
  ui: UiTranslator;
}) {
  const directItems = items.filter((item) => item.dossierId === dossier.id);
  const subDossiers = dossiers.filter((item) => item.parentDossierId === dossier.id);

  return (
    <Card title={dossier.name}>
      <div className="reference-stack">
        <ReferenceItem label={ui.t("project.status")} value={formatEnum(dossier.dossierType, ui)} />
        <ReferenceItem label={ui.t("dossier.subDossiers")} value={String(subDossiers.length)} />
      </div>

      {directItems.length === 0 ? <EmptyState title={ui.t("dossier.empty")} /> : null}
      {directItems.length > 0 ? (
        <ul className="stack-list">
          {directItems.map((item) => (
            <li className="reference-item" key={item.id}>
              <strong>{item.label ?? findDocumentTitle(documents, item.itemId) ?? item.itemId}</strong>
              <span>{formatEnum(item.itemType, ui)}</span>
            </li>
          ))}
        </ul>
      ) : null}

      {subDossiers.length > 0 ? (
        <div className="reference-stack">
          {subDossiers.map((subDossier) => (
            <Link
              className="document-selector-link"
              href={`/projects/${encodeURIComponent(projectId)}#${encodeURIComponent(subDossier.id)}`}
              id={subDossier.id}
              key={subDossier.id}
            >
              {subDossier.name}
            </Link>
          ))}
        </div>
      ) : null}
    </Card>
  );
}

function CreateDossierCard({ projectId, ui }: { projectId: string; ui: UiTranslator }) {
  return (
    <Card title={ui.t("dossier.createCustom")}>
      <form action={createProjectDossierAction} className="manuscript-form">
        <input name="projectId" type="hidden" value={projectId} />
        <Input label={ui.t("dossier.name")} name="name" required />
        <Button type="submit">{ui.t("action.createDossier")}</Button>
      </form>
    </Card>
  );
}

function CreateSubDossierCard({
  dossiers,
  projectId,
  ui
}: {
  dossiers: ProjectDossierRecord[];
  projectId: string;
  ui: UiTranslator;
}) {
  return (
    <Card title={ui.t("dossier.createSubDossier")}>
      <form action={createProjectDossierAction} className="manuscript-form">
        <input name="projectId" type="hidden" value={projectId} />
        <Input label={ui.t("dossier.name")} name="name" required />
        <Select
          label={ui.t("dossier.parent")}
          name="parentDossierId"
          options={dossiers.map((dossier) => ({ label: dossier.name, value: dossier.id }))}
          required
        />
        <Button type="submit">{ui.t("action.createSubDossier")}</Button>
      </form>
    </Card>
  );
}

function AssignDocumentCard({
  documents,
  dossiers,
  items,
  projectId,
  ui
}: {
  documents: DocumentRecord[];
  dossiers: ProjectDossierRecord[];
  items: ProjectDossierItemRecord[];
  projectId: string;
  ui: UiTranslator;
}) {
  const assignedDocumentIds = new Set(
    items.filter((item) => item.itemType === "DOCUMENT").map((item) => item.itemId)
  );
  const unassignedDocuments = documents.filter((document) => !assignedDocumentIds.has(document.id));

  return (
    <Card title={ui.t("dossier.assignDocument")}>
      {unassignedDocuments.length === 0 ? <EmptyState title={ui.t("dossier.noDocuments")} /> : null}
      {unassignedDocuments.length > 0 ? (
        <form action={assignProjectDossierItemAction} className="manuscript-form">
          <input name="projectId" type="hidden" value={projectId} />
          <input name="itemType" type="hidden" value="DOCUMENT" />
          <Select
            label={ui.t("dossier.document")}
            name="itemId"
            options={unassignedDocuments.map((document) => ({
              label: document.title,
              value: document.id
            }))}
            required
          />
          <Select
            label={ui.t("label.projectDossiers")}
            name="dossierId"
            options={dossiers.map((dossier) => ({ label: dossier.name, value: dossier.id }))}
            required
          />
          <Input label={ui.t("dossier.itemLabel")} name="label" />
          <Button type="submit">{ui.t("action.assignToDossier")}</Button>
        </form>
      ) : null}
    </Card>
  );
}

function topLevelDossiers(dossiers: ProjectDossierRecord[]): ProjectDossierRecord[] {
  return dossiers.filter((dossier) => !dossier.parentDossierId);
}

function findDocumentTitle(documents: DocumentRecord[], documentId: string): string | undefined {
  return documents.find((document) => document.id === documentId)?.title;
}

function formatEnum(value: string | undefined, ui: UiTranslator): string {
  return value ? value.replace(/_/g, " ") : ui.t("dossier.notRecorded");
}

function formatPublicationType(publicationType: ProjectPublicationType | undefined, ui: UiTranslator): string {
  if (!publicationType) {
    return ui.t("dossier.notRecorded");
  }

  const labels: Record<ProjectPublicationType, string> = {
    AUDIOBOOK: ui.t("project.publicationAudiobook"),
    BOOK: ui.t("project.publicationBook"),
    CHILDRENS_BOOK: ui.t("project.publicationChildrensBook"),
    COURSE: ui.t("project.publicationCourse"),
    DICTIONARY: ui.t("project.publicationDictionary"),
    MAGAZINE: ui.t("project.publicationMagazine"),
    POETRY: ui.t("project.publicationPoetry"),
    VIDEO: ui.t("project.publicationVideo")
  };

  return labels[publicationType];
}

function formatCapabilities(capabilities: ProjectCapability[] | undefined, ui: UiTranslator): string {
  if (!capabilities || capabilities.length === 0) {
    return ui.t("dossier.notRecorded");
  }

  const labels: Record<ProjectCapability, string> = {
    ACCESSIBILITY: ui.t("project.capabilityAccessibility"),
    AUDIOBOOK: ui.t("project.capabilityAudiobook"),
    FLIPBOOK: ui.t("project.capabilityFlipbook"),
    ILLUSTRATIONS: ui.t("project.capabilityIllustrations"),
    TRANSLATION: ui.t("project.capabilityTranslation"),
    VIDEO: ui.t("project.capabilityVideo")
  };

  return capabilities.map((capability) => labels[capability]).join(", ");
}

function formatEditorialProcess(
  editorialProcess: ProjectRecord["editorialProcess"],
  ui: UiTranslator
): string {
  if (!editorialProcess || editorialProcess.length === 0) {
    return ui.t("dossier.notRecorded");
  }

  return editorialProcess.map((stage) => stage.replace(/_/g, " ")).join(" -> ");
}

function ReferenceItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="reference-item">
      <strong>{label}</strong>
      <span>{value}</span>
    </div>
  );
}
