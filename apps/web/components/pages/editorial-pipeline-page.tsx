import type { ComponentProps } from "react";
import Link from "next/link";
import {
  type EditorialPipelineData,
  type EditorialPipelineIndexData,
  type EditorialPipelineStep,
  type PipelineStepStatus
} from "../../lib/editorial-pipeline-client";
import type { DocumentRecord } from "../../lib/projects-documents-api";
import {
  createUiTranslator,
  translatePipelineStepTitle,
  type UiTranslator
} from "../../lib/ui-i18n";
import { Badge, Card, EmptyState, ErrorState, PageHeader } from "../ui";

type BadgeTone = ComponentProps<typeof Badge>["tone"];

export function EditorialPipelineIndexPage({
  data,
  platformLanguage
}: {
  data: EditorialPipelineIndexData;
  platformLanguage?: string | null;
}) {
  const ui = createUiTranslator(platformLanguage);

  return (
    <main className="page-stack">
      <PageHeader
        eyebrow={ui.t("label.productionPipeline")}
        title={ui.t("pipeline.guidedEditorialProduction")}
      />

      {data.projectsError ? <ErrorState message={data.projectsError} title={ui.t("error.projectsUnavailable")} /> : null}
      {data.documentsError ? <ErrorState message={data.documentsError} title={ui.t("error.documentsUnavailable")} /> : null}

      <section className="metric-grid" aria-label="Pipeline overview">
        <Card>
          <div className="metric-card">
            <span>{ui.t("pipeline.projects")}</span>
            <strong>{data.projects.length}</strong>
            <Badge tone="info">{ui.t("badge.pipeline")}</Badge>
          </div>
        </Card>
        <Card>
          <div className="metric-card">
            <span>{ui.t("pipeline.activeWarnings")}</span>
            <strong>{data.projects.reduce((total, project) => total + project.warningCount, 0)}</strong>
            <Badge tone="warning">{ui.t("badge.review")}</Badge>
          </div>
        </Card>
        <Card>
          <div className="metric-card">
            <span>{ui.t("pipeline.productionMode")}</span>
            <strong>14</strong>
            <Badge tone="success">{ui.t("badge.steps")}</Badge>
          </div>
        </Card>
        <Card>
          <div className="metric-card">
            <span>{ui.t("pipeline.humanAuthority")}</span>
            <strong>{ui.t("pipeline.status.required")}</strong>
            <Badge tone="neutral">{ui.t("badge.approvalRule")}</Badge>
          </div>
        </Card>
      </section>

      <section className="content-panel">
        <div className="section-heading">
          <div>
            <p className="section-kicker">{ui.t("pipeline.projects")}</p>
            <h2>{ui.t("pipeline.editorialQueue")}</h2>
          </div>
          <Badge tone="info">{data.projects.length} {ui.t("pipeline.projects").toLowerCase()}</Badge>
        </div>

        {data.projects.length === 0 ? <EmptyState title={ui.t("pipeline.noProjects")} /> : null}

        {data.projects.length > 0 ? (
          <div className="pipeline-project-list">
            {data.projects.map((project) => (
              <Link className="pipeline-project-card" href={project.href} key={project.id}>
                <div>
                  <strong>{project.name}</strong>
                  <span>{project.languageSummary}</span>
                </div>
                <div className="pipeline-project-meta">
                  <Badge tone={project.status === "ACTIVE" ? "success" : "neutral"}>{project.status}</Badge>
                  <Badge tone={project.warningCount > 0 ? "warning" : "info"}>
                    {translatePipelineStepTitle(project.currentStepLabel, platformLanguage)}
                  </Badge>
                  <span>{project.documentCount} {ui.t("pipeline.documentCount")}</span>
                </div>
              </Link>
            ))}
          </div>
        ) : null}
      </section>
    </main>
  );
}

export function EditorialPipelineProjectPage({
  data,
  platformLanguage
}: {
  data: EditorialPipelineData;
  platformLanguage?: string | null;
}) {
  const ui = createUiTranslator(platformLanguage);
  const projectTitle = data.project?.name ?? "Project not found";

  return (
    <main className="page-stack">
      <PageHeader
        actions={
          <Link className="ui-button ui-button-secondary ui-button-md" href="/pipeline">
            {ui.t("pipeline.allPipelines")}
          </Link>
        }
        eyebrow={ui.t("label.productionPipeline")}
        title={projectTitle}
      />

      {data.projectsError ? <ErrorState message={data.projectsError} title={ui.t("error.projectsUnavailable")} /> : null}
      {data.documentsError ? <ErrorState message={data.documentsError} title={ui.t("error.documentsUnavailable")} /> : null}
      {data.segmentsError ? <ErrorState message={data.segmentsError} title={ui.t("error.segmentsUnavailable")} /> : null}
      {data.translationsError ? <ErrorState message={data.translationsError} title={ui.t("error.translationsUnavailable")} /> : null}
      {data.workflowError ? <ErrorState message={data.workflowError} title={ui.t("error.workflowUnavailable")} /> : null}
      {data.rightsError ? <ErrorState message={data.rightsError} title={ui.t("error.rightsUnavailable")} /> : null}

      <PipelineSummary data={data} platformLanguage={platformLanguage} ui={ui} />

      {data.documents.length > 1 ? (
        <DocumentSwitcher documents={data.documents} selectedDocumentId={data.selectedDocument?.id} ui={ui} />
      ) : null}

      <section className="content-panel">
        <div className="section-heading">
          <div>
            <p className="section-kicker">{ui.t("pipeline.guidedWorkflow")}</p>
            <h2>{ui.t("pipeline.editingSequence")}</h2>
          </div>
          <Badge tone={data.nextStep ? toneForStatus(data.nextStep.status) : "success"}>
            {data.nextStep ? translatePipelineStepTitle(data.nextStep.title, platformLanguage) : ui.t("pipeline.closed")}
          </Badge>
        </div>

        <div className="pipeline-layout">
          <div className="pipeline-vertical" aria-label="Editorial production pipeline">
            {data.steps.map((step, index) => (
              <PipelineStepCard
                index={index + 1}
                key={step.id}
                platformLanguage={platformLanguage}
                step={step}
                ui={ui}
              />
            ))}
          </div>
          <aside className="pipeline-side-panel" aria-label="Pipeline guidance">
            <AudiobookPanel data={data} ui={ui} />
            <VideoPanel data={data} ui={ui} />
            <Card title={ui.t("pipeline.aiProgressSummary")}>
              <p className="pipeline-guidance">{data.aiRecommendation}</p>
              <p className="review-human-authority">
                {ui.t("pipeline.humanAuthorityGuidance")}
              </p>
            </Card>
            <Card title={ui.t("pipeline.warnings")}>
              {allWarnings(data.steps).length === 0 ? (
                <EmptyState title={ui.t("pipeline.noWarnings")} />
              ) : (
                <div className="reference-stack">
                  {allWarnings(data.steps).map((warning) => (
                    <div className="pipeline-warning" key={warning}>
                      <Badge tone="warning">{ui.t("badge.warning")}</Badge>
                      <span>{warning}</span>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </aside>
        </div>
      </section>
    </main>
  );
}

function AudiobookPanel({ data, ui }: { data: EditorialPipelineData; ui: UiTranslator }) {
  return (
    <Card title={ui.t("pipeline.audiobookProduction")}>
      <div className="audiobook-status-grid">
        <div>
          <span>{ui.t("action.previewAudio")}</span>
          <strong>{ui.t("pipeline.status.available")}</strong>
          <Badge tone="info">{ui.t("badge.draftOnly")}</Badge>
        </div>
        <div>
          <span>{ui.t("pipeline.audiobookStatus")}</span>
          <strong>{data.audiobook.audiobookStatus.replace(/_/g, " ")}</strong>
          <Badge tone={data.audiobook.audiobookStatus === "READY_FOR_GENERATION" ? "success" : "neutral"}>
            {ui.t("badge.official")}
          </Badge>
        </div>
        <div>
          <span>{ui.t("pipeline.narrator")}</span>
          <strong>{data.audiobook.narrator}</strong>
        </div>
        <div>
          <span>{ui.t("pipeline.voice")}</span>
          <strong>{data.audiobook.voice}</strong>
        </div>
        <div>
          <span>{ui.t("pipeline.language")}</span>
          <strong>{data.audiobook.language}</strong>
        </div>
        <div>
          <span>{ui.t("pipeline.export")}</span>
          <strong>{data.audiobook.exportFormats.join(", ")}</strong>
        </div>
      </div>

      <div className="audiobook-progress">
        <div>
          <span>{ui.t("pipeline.progress")}</span>
          <strong>{data.audiobook.progressPercent}%</strong>
        </div>
        <div className="pipeline-progress" aria-label={`Audiobook progress ${data.audiobook.progressPercent}%`}>
          <span style={{ width: `${data.audiobook.progressPercent}%` }} />
        </div>
      </div>

      <div className="audiobook-preview-controls" aria-label="Preview Audio draft controls">
        <label className="ui-input-field">
          <span>{ui.t("pipeline.voiceSelection")}</span>
          <select className="ui-input ui-select" defaultValue="draft-studio-voice">
            <option value="draft-studio-voice">Draft studio voice</option>
            <option value="warm-editorial">Warm editorial</option>
            <option value="clear-neutral">Clear neutral</option>
          </select>
        </label>
        <label className="ui-input-field">
          <span>{ui.t("pipeline.localeAccent")}</span>
          <select className="ui-input ui-select" defaultValue={data.audiobook.language}>
            <option value={data.audiobook.language}>{data.audiobook.language}</option>
            <option value="English (en-GB)">English (en-GB)</option>
            <option value="Romanian (ro-RO)">Romanian (ro-RO)</option>
            <option value="French (fr-FR)">French (fr-FR)</option>
          </select>
        </label>
        <label className="ui-input-field">
          <span>{ui.t("pipeline.playbackSpeed")}</span>
          <select className="ui-input ui-select" defaultValue="1">
            <option value="0.85">0.85x</option>
            <option value="1">1x</option>
            <option value="1.15">1.15x</option>
          </select>
        </label>
      </div>

      <p className="pipeline-guidance">
        {ui.t("pipeline.previewAudioGuidance")}
      </p>

      <div className="pipeline-step-actions">
        {data.audiobook.previewHref ? (
          <Link className="ui-button ui-button-secondary ui-button-sm" href={data.audiobook.previewHref}>
            {ui.t("action.previewAudio")}
          </Link>
        ) : (
          <button className="ui-button ui-button-secondary ui-button-sm" disabled type="button">
            {ui.t("action.previewAudio")}
          </button>
        )}
        {data.audiobook.previewHref ? (
          <Link className="ui-button ui-button-secondary ui-button-sm" href={data.audiobook.previewHref}>
            {ui.t("action.regeneratePreview")}
          </Link>
        ) : (
          <button className="ui-button ui-button-secondary ui-button-sm" disabled type="button">
            {ui.t("action.regeneratePreview")}
          </button>
        )}
        {data.audiobook.generateHref ? (
          <Link className="ui-button ui-button-primary ui-button-sm" href={data.audiobook.generateHref}>
            {ui.t("action.generateAudiobook")}
          </Link>
        ) : (
          <button className="ui-button ui-button-primary ui-button-sm" disabled type="button">
            {ui.t("action.generateAudiobook")}
          </button>
        )}
      </div>

      {data.audiobook.generateHref ? null : (
        <p className="pipeline-guidance">{data.audiobook.officialLockedReason}</p>
      )}
    </Card>
  );
}

function VideoPanel({ data, ui }: { data: EditorialPipelineData; ui: UiTranslator }) {
  return (
    <Card title={ui.t("pipeline.videoProduction")}>
      <div className="video-status-grid">
        <div>
          <span>{ui.t("pipeline.videoPreview")}</span>
          <strong>{data.video.previewAvailable ? ui.t("pipeline.status.available") : ui.t("pipeline.status.locked")}</strong>
          <Badge tone="info">{ui.t("badge.draftOnly")}</Badge>
        </div>
        <div>
          <span>{ui.t("pipeline.videoStatus")}</span>
          <strong>{data.video.videoStatus.replace(/_/g, " ")}</strong>
          <Badge tone={data.video.videoStatus === "READY_FOR_GENERATION" ? "success" : "neutral"}>
            {ui.t("badge.official")}
          </Badge>
        </div>
        <div>
          <span>Format</span>
          <strong>{data.video.exportFormat}</strong>
        </div>
        <div>
          <span>Voice-over source</span>
          <strong>{data.video.voiceOverSource}</strong>
        </div>
        <div>
          <span>Subtitle language/locale</span>
          <strong>{data.video.subtitleLanguageLocale}</strong>
        </div>
        <div>
          <span>Export status</span>
          <strong>{data.video.exportStatus.replace(/_/g, " ")}</strong>
        </div>
        <div className="video-metadata-card">
          <span>Thumbnail/cover metadata</span>
          <strong>{data.video.thumbnailMetadata}</strong>
        </div>
      </div>

      <div className="video-progress">
        <div>
          <span>{ui.t("pipeline.progress")}</span>
          <strong>{data.video.progressPercent}%</strong>
        </div>
        <div className="pipeline-progress" aria-label={`Video progress ${data.video.progressPercent}%`}>
          <span style={{ width: `${data.video.progressPercent}%` }} />
        </div>
      </div>

      <p className="pipeline-guidance">
        {ui.t("pipeline.videoGuidance")}
      </p>

      <div className="pipeline-step-actions">
        {data.video.previewHref ? (
          <Link className="ui-button ui-button-secondary ui-button-sm" href={data.video.previewHref}>
            {ui.t("action.generatePreviewVideo")}
          </Link>
        ) : (
          <button className="ui-button ui-button-secondary ui-button-sm" disabled type="button">
            {ui.t("action.generatePreviewVideo")}
          </button>
        )}
        {data.video.generateHref ? (
          <Link className="ui-button ui-button-primary ui-button-sm" href={data.video.generateHref}>
            {ui.t("action.generateOfficialVideo")}
          </Link>
        ) : (
          <button className="ui-button ui-button-primary ui-button-sm" disabled type="button">
            {ui.t("action.generateOfficialVideo")}
          </button>
        )}
      </div>

      {data.video.generateHref ? null : (
        <p className="pipeline-guidance">{data.video.officialLockedReason}</p>
      )}
    </Card>
  );
}

function PipelineSummary({
  data,
  platformLanguage,
  ui
}: {
  data: EditorialPipelineData;
  platformLanguage?: string | null;
  ui: UiTranslator;
}) {
  const completed = data.steps.filter((step) => step.status === "COMPLETED").length;
  const needsAttention = data.steps.filter((step) => step.status === "NEEDS_ATTENTION").length;
  const locked = data.steps.filter((step) => step.locked).length;
  const completion = Math.round((completed / Math.max(data.steps.length, 1)) * 100);

  return (
    <section className="metric-grid" aria-label="Production pipeline status">
      <Card>
        <div className="metric-card">
          <span>{ui.t("pipeline.completion")}</span>
          <strong>{completion}%</strong>
          <Badge tone="info">{ui.t("badge.guided")}</Badge>
        </div>
      </Card>
      <Card>
        <div className="metric-card">
          <span>{ui.t("pipeline.nextStep")}</span>
          <strong>{data.nextStep ? translatePipelineStepTitle(data.nextStep.title, platformLanguage) : ui.t("pipeline.status.done")}</strong>
          <Badge tone={data.nextStep ? toneForStatus(data.nextStep.status) : "success"}>{ui.t("badge.next")}</Badge>
        </div>
      </Card>
      <Card>
        <div className="metric-card">
          <span>{ui.t("pipeline.needsAttention")}</span>
          <strong>{needsAttention}</strong>
          <Badge tone={needsAttention > 0 ? "warning" : "success"}>{ui.t("pipeline.warnings")}</Badge>
        </div>
      </Card>
      <Card>
        <div className="metric-card">
          <span>{ui.t("pipeline.locked")}</span>
          <strong>{locked}</strong>
          <Badge tone="neutral">{ui.t("badge.gated")}</Badge>
        </div>
      </Card>
    </section>
  );
}

function DocumentSwitcher({
  documents,
  selectedDocumentId,
  ui
}: {
  documents: DocumentRecord[];
  selectedDocumentId?: string;
  ui: UiTranslator;
}) {
  return (
    <Card title={ui.t("pipeline.documentsInProject")}>
      <div className="pipeline-document-list">
        {documents.map((document) => (
          <Link
            className={
              document.id === selectedDocumentId
                ? "pipeline-document-link pipeline-document-link-active"
                : "pipeline-document-link"
            }
            href={`/pipeline/${encodeURIComponent(document.projectId)}?documentId=${encodeURIComponent(document.id)}`}
            key={document.id}
          >
            <strong>{document.title}</strong>
            <span>{document.status}</span>
          </Link>
        ))}
      </div>
    </Card>
  );
}

function PipelineStepCard({
  index,
  platformLanguage,
  ui,
  step
}: {
  index: number;
  platformLanguage?: string | null;
  ui: UiTranslator;
  step: EditorialPipelineStep;
}) {
  return (
    <article className={`pipeline-step pipeline-step-${step.status.toLowerCase().replace(/_/g, "-")}`}>
      <div className="pipeline-step-marker" aria-hidden="true">
        {step.status === "COMPLETED" ? "✓" : index}
      </div>
      <div className="pipeline-step-body">
        <div className="pipeline-step-heading">
          <div>
            <p className="section-kicker">{ui.t("pipeline.step")} {index}</p>
            <h2>{translatePipelineStepTitle(step.title, platformLanguage)}</h2>
          </div>
          <Badge tone={toneForStatus(step.status)}>{labelForStatus(step.status, ui)}</Badge>
        </div>

        <p>{step.summary}</p>

        <div className="pipeline-progress" aria-label={`${step.title} completion ${step.completionPercent}%`}>
          <span style={{ width: `${step.completionPercent}%` }} />
        </div>

        <div className="pipeline-module-list" aria-label={`${step.title} source modules`}>
          {step.sourceModules.map((module) => (
            <Badge key={module} tone="neutral">{module}</Badge>
          ))}
        </div>

        {step.warnings.length > 0 ? (
          <ul className="pipeline-warning-list">
            {step.warnings.map((warning) => (
              <li key={warning}>{warning}</li>
            ))}
          </ul>
        ) : null}

        <div className="pipeline-step-actions">
          {step.continueHref && !step.locked ? (
            <Link className="ui-button ui-button-primary ui-button-sm" href={step.continueHref}>
              {ui.t("action.continue")}
            </Link>
          ) : (
            <button className="ui-button ui-button-primary ui-button-sm" disabled type="button">
              {ui.t("action.continue")}
            </button>
          )}
          {step.openHref && !step.locked ? (
            <Link className="ui-button ui-button-secondary ui-button-sm" href={step.openHref}>
              {ui.t("action.openWorkspace")}
            </Link>
          ) : (
            <button className="ui-button ui-button-secondary ui-button-sm" disabled type="button">
              {ui.t("action.openWorkspace")}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

function labelForStatus(status: PipelineStepStatus, ui: UiTranslator): string {
  const statusLabelKeys: Record<PipelineStepStatus, Parameters<UiTranslator["t"]>[0]> = {
    COMPLETED: "pipeline.status.done",
    IN_PROGRESS: "badge.guided",
    LOCKED: "pipeline.status.locked",
    NEEDS_ATTENTION: "pipeline.needsAttention",
    READY: "badge.ready"
  };

  return ui.t(statusLabelKeys[status]);
}

function toneForStatus(status: PipelineStepStatus): BadgeTone {
  if (status === "COMPLETED") {
    return "success";
  }

  if (status === "NEEDS_ATTENTION") {
    return "warning";
  }

  if (status === "LOCKED") {
    return "neutral";
  }

  if (status === "READY") {
    return "info";
  }

  return "warning";
}

function allWarnings(steps: EditorialPipelineStep[]): string[] {
  return [...new Set(steps.flatMap((step) => step.warnings))];
}
