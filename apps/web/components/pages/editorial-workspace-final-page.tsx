import Link from "next/link";
import type { ApiResult } from "../../lib/api-client";
import type {
  EditorialWorkspaceAction,
  EditorialWorkspaceData,
  EditorialWorkspaceFormatGroup,
  EditorialWorkspaceTool
} from "../../lib/editorial-workspace-client";
import { createUiTranslator } from "../../lib/ui-i18n";
import type { WorkspaceDashboard } from "../../lib/workspace-types";
import { Badge, Card, EmptyState, ErrorState, PageHeader } from "../ui";

interface EditorialWorkspaceFinalPageProps {
  dashboardResult: ApiResult<WorkspaceDashboard>;
  workspace: EditorialWorkspaceData;
}

export function EditorialWorkspaceFinalPage({
  dashboardResult,
  workspace
}: EditorialWorkspaceFinalPageProps) {
  const platformLanguage =
    dashboardResult.data?.preferences.platformLanguage ??
    dashboardResult.data?.preferences.language;
  const ui = createUiTranslator(platformLanguage);
  const activeWarnings = workspace.projects.reduce((total, project) => total + project.warningCount, 0);

  return (
    <main className="page-stack editorial-workspace-final" data-workspace-mode="individual-first-instant-collaboration">
      <PageHeader
        actions={
          <>
            <Link className="ui-button ui-button-primary ui-button-md" href="/projects/new">
              {ui.t("action.createProject")}
            </Link>
            <Link className="ui-button ui-button-secondary ui-button-md" href="/pipeline">
              {ui.t("label.productionPipeline")}
            </Link>
            <Link className="ui-button ui-button-secondary ui-button-md" href="/distribution">
              {ui.t("label.distributionCenter")}
            </Link>
          </>
        }
        eyebrow={ui.t("workspaceFinal.eyebrow")}
        title={ui.t("workspaceFinal.title")}
      />

      {dashboardResult.error ? (
        <ErrorState message={dashboardResult.error} title={ui.t("dashboard.workspaceDashboardUnavailable")} />
      ) : null}
      {workspace.projectsError ? <ErrorState message={workspace.projectsError} title={ui.t("error.projectsUnavailable")} /> : null}

      <section className="metric-grid" aria-label="Editorial workspace status">
        <Card>
          <div className="metric-card">
            <span>{ui.t("workspaceFinal.publicationTypes")}</span>
            <strong>{workspace.publicationTypes.length}</strong>
            <Badge tone="info">{ui.t("badge.ready")}</Badge>
          </div>
        </Card>
        <Card>
          <div className="metric-card">
            <span>{ui.t("workspaceFinal.commonActions")}</span>
            <strong>2-3</strong>
            <Badge tone="success">{ui.t("workspaceFinal.maxClicks")}</Badge>
          </div>
        </Card>
        <Card>
          <div className="metric-card">
            <span>{ui.t("pipeline.projects")}</span>
            <strong>{workspace.projects.length}</strong>
            <Badge tone="neutral">{ui.t("workspaceFinal.singleWorkspace")}</Badge>
          </div>
        </Card>
        <Card>
          <div className="metric-card">
            <span>{ui.t("pipeline.activeWarnings")}</span>
            <strong>{activeWarnings}</strong>
            <Badge tone={activeWarnings > 0 ? "warning" : "success"}>
              {activeWarnings > 0 ? ui.t("badge.warning") : ui.t("badge.ready")}
            </Badge>
          </div>
        </Card>
      </section>

      <section className="editorial-workspace-hero" aria-label="Unified editorial workspace">
        <div className="editorial-workspace-hero-main">
          <div className="section-heading">
            <div>
              <p className="section-kicker">{ui.t("workspaceFinal.centralObject")}</p>
              <h2>{ui.t("workspaceFinal.manuscriptFirst")}</h2>
            </div>
            <Badge tone="success">{ui.t("workspaceFinal.primaryEnvironment")}</Badge>
          </div>
          <div className="editorial-canvas-preview">
            <div className="editorial-page-thumbnail-rail" aria-label="Page thumbnails">
              {["Cover", "1", "2", "3", "TOC"].map((thumbnail) => (
                <span key={thumbnail}>{thumbnail}</span>
              ))}
            </div>
            <div className="editorial-manuscript-surface">
              <div className="editorial-ruler editorial-ruler-horizontal" />
              <div className="editorial-ruler editorial-ruler-vertical" />
              <article>
                <header>
                  <span>{ui.t("workspaceFinal.livePreview")}</span>
                  <h3>{ui.t("workspaceFinal.oneWorkspaceAllProduction")}</h3>
                </header>
                <p>
                  {ui.t("workspaceFinal.manuscriptDescription")}
                </p>
                <div className="editorial-grid-guides" aria-hidden="true" />
              </article>
            </div>
          </div>
        </div>

        <aside className="editorial-workspace-side" aria-label="Fast editorial actions">
          <Card title={ui.t("workspaceFinal.fastActions")}>
            <div className="editorial-action-list">
              {workspace.actions.map((action) => (
                <WorkspaceAction action={action} key={action.id} />
              ))}
            </div>
          </Card>
          <Card title={ui.t("pipeline.humanAuthority")}>
            <p className="pipeline-guidance">
              {ui.t("workspaceFinal.humanAuthority")}
            </p>
          </Card>
        </aside>
      </section>

      <section className="content-panel" aria-label="Production queue">
        <div className="section-heading">
          <div>
            <p className="section-kicker">{ui.t("workspaceFinal.productionQueue")}</p>
            <h2>{ui.t("workspaceFinal.currentProjects")}</h2>
          </div>
          <Badge tone="info">{workspace.projects.length} {ui.t("pipeline.projects").toLowerCase()}</Badge>
        </div>
        {workspace.projects.length === 0 ? (
          <EmptyState
            description={ui.t("workspaceFinal.noProjectsDescription")}
            title={ui.t("pipeline.noProjects")}
          />
        ) : (
          <div className="editorial-project-strip">
            {workspace.projects.slice(0, 6).map((project) => (
              <Link className="pipeline-project-card" href={project.href} key={project.id}>
                <div>
                  <strong>{project.name}</strong>
                  <span>{project.languageSummary}</span>
                </div>
                <div className="pipeline-project-meta">
                  <Badge tone={project.warningCount > 0 ? "warning" : "success"}>
                    {project.currentStepLabel}
                  </Badge>
                  <span>{project.documentCount} {ui.t("pipeline.documentCount")}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="editorial-workspace-grid" aria-label="Translation review and collaboration">
        <TranslationReviewPanel reviewModes={workspace.reviewModes} />
        <CollaborationPanel features={workspace.collaborationFeatures} />
      </section>

      <section className="editorial-workspace-grid" aria-label="Formats and production tools">
        <FormatPanel formatGroups={workspace.formatGroups} targets={workspace.adaptationTargets} />
        <ProductionToolsPanel tools={workspace.productionTools} />
      </section>

      <section className="editorial-workspace-grid" aria-label="Panels and performance">
        <PanelSystemPanel behavior={workspace.panelBehavior} panels={workspace.panels} />
        <PerformancePanel targets={workspace.performanceTargets} />
      </section>
    </main>
  );
}

function WorkspaceAction({ action }: { action: EditorialWorkspaceAction }) {
  return (
    <Link className="editorial-action-card" href={action.href}>
      <div>
        <strong>{action.label}</strong>
        <span>{action.summary}</span>
      </div>
      <Badge tone={action.maxClicks <= 2 ? "success" : "warning"}>
        {action.maxClicks} clicks
      </Badge>
    </Link>
  );
}

function TranslationReviewPanel({ reviewModes }: { reviewModes: string[] }) {
  return (
    <section className="content-panel">
      <div className="section-heading">
        <div>
          <p className="section-kicker">Translation & Review</p>
          <h2>Default 2-column comparison</h2>
        </div>
        <Badge tone="success">Immutable original</Badge>
      </div>
      <div className="editorial-review-preview">
        <article>
          <span>Column 1</span>
          <h3>Original</h3>
          <p>Original text remains locked and auditable.</p>
        </article>
        <article>
          <span>Column 2</span>
          <h3>Translation</h3>
          <p>
            Translation text shows <mark>highlighted proposed variants</mark> until an
            authorized human accepts or rejects them.
          </p>
        </article>
      </div>
      <div className="editorial-chip-list" aria-label="Review modes">
        {reviewModes.map((mode) => (
          <Badge key={mode} tone={mode === "Accept/Reject" ? "success" : "neutral"}>
            {mode}
          </Badge>
        ))}
      </div>
    </section>
  );
}

function CollaborationPanel({ features }: { features: string[] }) {
  return (
    <section className="content-panel" id="collaboration">
      <div className="section-heading">
        <div>
          <p className="section-kicker">Collaboration</p>
          <h2>Individual-first, instantly collaborative</h2>
        </div>
        <a className="ui-button ui-button-secondary ui-button-sm" href="#collaboration">
          Invite collaborator
        </a>
      </div>
      <div className="editorial-chip-list">
        {features.map((feature) => (
          <Badge key={feature} tone={feature === "audit" || feature === "version history" ? "info" : "neutral"}>
            {feature}
          </Badge>
        ))}
      </div>
      <p className="pipeline-guidance editorial-panel-copy">
        Collaboration activates in the same workspace through role, chapter, and segment scope.
        Need-to-know access, comments, mentions, synchronized updates, audit, and version
        history are preserved without adding interface complexity.
      </p>
    </section>
  );
}

function FormatPanel({
  formatGroups,
  targets
}: {
  formatGroups: EditorialWorkspaceFormatGroup[];
  targets: string[];
}) {
  return (
    <section className="content-panel">
      <div className="section-heading">
        <div>
          <p className="section-kicker">Publication formats</p>
          <h2>Configurable format system</h2>
        </div>
        <Badge tone="success">Change anytime</Badge>
      </div>
      <div className="editorial-format-groups">
        {formatGroups.map((group) => (
          <div className="editorial-format-group" key={group.id}>
            <strong>{group.title}</strong>
            <div>
              {group.formats.map((format) => (
                <span key={`${group.id}-${format}`}>{format}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="editorial-adaptation-panel">
        <strong>Automatic layout adaptation</strong>
        <p>
          Format changes adapt layout, templates, styles, guides, image placement,
          page numbering, export settings, and previews without manual reconstruction.
        </p>
        <div className="editorial-chip-list">
          {targets.map((target) => (
            <Badge key={target} tone="info">{target}</Badge>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductionToolsPanel({ tools }: { tools: EditorialWorkspaceTool[] }) {
  return (
    <section className="content-panel">
      <div className="section-heading">
        <div>
          <p className="section-kicker">Editorial production tools</p>
          <h2>Useful InDesign-inspired functions, not Adobe UI</h2>
        </div>
        <Badge tone="neutral">{tools.length} tools</Badge>
      </div>
      <div className="editorial-tool-grid">
        {tools.map((tool) => (
          <article className="editorial-tool-card" key={tool.id}>
            <strong>{tool.label}</strong>
            <span>{tool.summary}</span>
          </article>
        ))}
      </div>
    </section>
  );
}

function PanelSystemPanel({
  behavior,
  panels
}: {
  behavior: string[];
  panels: Array<{ id: string; label: string; relevantFor: string[] }>;
}) {
  return (
    <section className="content-panel">
      <div className="section-heading">
        <div>
          <p className="section-kicker">Workspace panels</p>
          <h2>Relevant tools only</h2>
        </div>
        <Badge tone="success">Restorable</Badge>
      </div>
      <div className="editorial-chip-list">
        {behavior.map((item) => (
          <Badge key={item} tone="neutral">{item}</Badge>
        ))}
      </div>
      <div className="editorial-panel-list">
        {panels.map((panel) => (
          <article key={panel.id}>
            <strong>{panel.label}</strong>
            <span>{panel.relevantFor.join(", ")}</span>
          </article>
        ))}
      </div>
    </section>
  );
}

function PerformancePanel({ targets }: { targets: string[] }) {
  return (
    <section className="content-panel">
      <div className="section-heading">
        <div>
          <p className="section-kicker">Performance</p>
          <h2>Large-production readiness</h2>
        </div>
        <Badge tone="info">Fast workspace</Badge>
      </div>
      <div className="editorial-performance-list">
        {targets.map((target) => (
          <div key={target}>
            <strong>{target}</strong>
            <span>Usability must remain stable and responsive.</span>
          </div>
        ))}
      </div>
    </section>
  );
}
