import type { ComponentProps } from "react";
import Link from "next/link";
import {
  type EditorialPipelineData,
  type EditorialPipelineIndexData,
  type EditorialPipelineStep,
  type PipelineStepStatus
} from "../../lib/editorial-pipeline-client";
import type { DocumentRecord } from "../../lib/projects-documents-api";
import { Badge, Card, EmptyState, ErrorState, PageHeader } from "../ui";

type BadgeTone = ComponentProps<typeof Badge>["tone"];

export function EditorialPipelineIndexPage({
  data
}: {
  data: EditorialPipelineIndexData;
}) {
  return (
    <main className="page-stack">
      <PageHeader eyebrow="Production Pipeline" title="Guided editorial production" />

      {data.projectsError ? <ErrorState message={data.projectsError} title="Projects unavailable" /> : null}
      {data.documentsError ? <ErrorState message={data.documentsError} title="Documents unavailable" /> : null}

      <section className="metric-grid" aria-label="Pipeline overview">
        <Card>
          <div className="metric-card">
            <span>Projects</span>
            <strong>{data.projects.length}</strong>
            <Badge tone="info">Pipeline</Badge>
          </div>
        </Card>
        <Card>
          <div className="metric-card">
            <span>Active warnings</span>
            <strong>{data.projects.reduce((total, project) => total + project.warningCount, 0)}</strong>
            <Badge tone="warning">Review</Badge>
          </div>
        </Card>
        <Card>
          <div className="metric-card">
            <span>Production mode</span>
            <strong>10</strong>
            <Badge tone="success">Steps</Badge>
          </div>
        </Card>
        <Card>
          <div className="metric-card">
            <span>Approval rule</span>
            <strong>Human</strong>
            <Badge tone="neutral">Final authority</Badge>
          </div>
        </Card>
      </section>

      <section className="content-panel">
        <div className="section-heading">
          <div>
            <p className="section-kicker">Projects</p>
            <h2>Editorial production queue</h2>
          </div>
          <Badge tone="info">{data.projects.length} projects</Badge>
        </div>

        {data.projects.length === 0 ? <EmptyState title="No projects ready for pipeline" /> : null}

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
                    {project.currentStepLabel}
                  </Badge>
                  <span>{project.documentCount} documents</span>
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
  data
}: {
  data: EditorialPipelineData;
}) {
  const projectTitle = data.project?.name ?? "Project not found";

  return (
    <main className="page-stack">
      <PageHeader
        actions={
          <Link className="ui-button ui-button-secondary ui-button-md" href="/pipeline">
            All pipelines
          </Link>
        }
        eyebrow="Production Pipeline"
        title={projectTitle}
      />

      {data.projectsError ? <ErrorState message={data.projectsError} title="Projects unavailable" /> : null}
      {data.documentsError ? <ErrorState message={data.documentsError} title="Documents unavailable" /> : null}
      {data.segmentsError ? <ErrorState message={data.segmentsError} title="Segments unavailable" /> : null}
      {data.translationsError ? <ErrorState message={data.translationsError} title="Translations unavailable" /> : null}
      {data.workflowError ? <ErrorState message={data.workflowError} title="Workflow unavailable" /> : null}
      {data.rightsError ? <ErrorState message={data.rightsError} title="Rights unavailable" /> : null}

      <PipelineSummary data={data} />

      {data.documents.length > 1 ? (
        <DocumentSwitcher documents={data.documents} selectedDocumentId={data.selectedDocument?.id} />
      ) : null}

      <section className="content-panel">
        <div className="section-heading">
          <div>
            <p className="section-kicker">Guided workflow</p>
            <h2>Import → Analysis → Editing → Review → Validation → Layout → Export → Approval → Publication</h2>
          </div>
          <Badge tone={data.nextStep ? toneForStatus(data.nextStep.status) : "success"}>
            {data.nextStep?.title ?? "Complete"}
          </Badge>
        </div>

        <div className="pipeline-layout">
          <div className="pipeline-vertical" aria-label="Editorial production pipeline">
            {data.steps.map((step, index) => (
              <PipelineStepCard
                index={index + 1}
                key={step.id}
                step={step}
              />
            ))}
          </div>
          <aside className="pipeline-side-panel" aria-label="Pipeline guidance">
            <Card title="AI progress summary">
              <p className="pipeline-guidance">{data.aiRecommendation}</p>
              <p className="review-human-authority">
                AI may summarize progress, suggest next actions, and detect blockers. It cannot approve workflow, publish, or grant rights.
              </p>
            </Card>
            <Card title="Warnings">
              {allWarnings(data.steps).length === 0 ? (
                <EmptyState title="No active pipeline warnings" />
              ) : (
                <div className="reference-stack">
                  {allWarnings(data.steps).map((warning) => (
                    <div className="pipeline-warning" key={warning}>
                      <Badge tone="warning">Warning</Badge>
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

function PipelineSummary({ data }: { data: EditorialPipelineData }) {
  const completed = data.steps.filter((step) => step.status === "COMPLETED").length;
  const needsAttention = data.steps.filter((step) => step.status === "NEEDS_ATTENTION").length;
  const locked = data.steps.filter((step) => step.locked).length;
  const completion = Math.round((completed / Math.max(data.steps.length, 1)) * 100);

  return (
    <section className="metric-grid" aria-label="Production pipeline status">
      <Card>
        <div className="metric-card">
          <span>Completion</span>
          <strong>{completion}%</strong>
          <Badge tone="info">Guided</Badge>
        </div>
      </Card>
      <Card>
        <div className="metric-card">
          <span>Next step</span>
          <strong>{data.nextStep?.title ?? "Done"}</strong>
          <Badge tone={data.nextStep ? toneForStatus(data.nextStep.status) : "success"}>Next</Badge>
        </div>
      </Card>
      <Card>
        <div className="metric-card">
          <span>Needs attention</span>
          <strong>{needsAttention}</strong>
          <Badge tone={needsAttention > 0 ? "warning" : "success"}>Warnings</Badge>
        </div>
      </Card>
      <Card>
        <div className="metric-card">
          <span>Locked</span>
          <strong>{locked}</strong>
          <Badge tone="neutral">Gated</Badge>
        </div>
      </Card>
    </section>
  );
}

function DocumentSwitcher({
  documents,
  selectedDocumentId
}: {
  documents: DocumentRecord[];
  selectedDocumentId?: string;
}) {
  return (
    <Card title="Documents in this project">
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
  step
}: {
  index: number;
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
            <p className="section-kicker">Step {index}</p>
            <h2>{step.title}</h2>
          </div>
          <Badge tone={toneForStatus(step.status)}>{labelForStatus(step.status)}</Badge>
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
              Continue
            </Link>
          ) : (
            <button className="ui-button ui-button-primary ui-button-sm" disabled type="button">
              Continue
            </button>
          )}
          {step.openHref && !step.locked ? (
            <Link className="ui-button ui-button-secondary ui-button-sm" href={step.openHref}>
              Open workspace
            </Link>
          ) : (
            <button className="ui-button ui-button-secondary ui-button-sm" disabled type="button">
              Open workspace
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

function labelForStatus(status: PipelineStepStatus): string {
  return status.replace(/_/g, " ");
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
