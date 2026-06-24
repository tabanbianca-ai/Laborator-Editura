import type { ApiResult } from "../../lib/api-client";
import type { WorkspaceDashboard, WorkspaceWidget } from "../../lib/workspace-types";
import { Badge, Card, EmptyState, ErrorState, PageHeader } from "../ui";

interface DashboardPageProps {
  dashboardResult: ApiResult<WorkspaceDashboard>;
}

const widgetToneByType: Partial<Record<WorkspaceWidget["widgetType"], "info" | "success" | "warning" | "neutral">> = {
  AI_USAGE: "info",
  BACKUP_STATUS: "success",
  BUDGET_USAGE: "warning",
  MARKETPLACE_AGENTS: "info",
  OBSERVABILITY_SUMMARY: "neutral",
  PUBLISHING_STATUS: "success",
  SECURITY_ALERTS: "warning",
  TRANSLATION_PROGRESS: "success"
};

export function DashboardPage({ dashboardResult }: DashboardPageProps) {
  if (dashboardResult.error) {
    return (
      <ErrorState
        message={dashboardResult.error}
        title="Workspace dashboard unavailable"
      />
    );
  }

  const dashboard = dashboardResult.data;

  if (!dashboard) {
    return (
      <EmptyState
        description="No workspace dashboard metadata is available for this session."
        title="No dashboard"
      />
    );
  }

  const visibleWidgets = dashboard.widgets
    .filter((widget) => widget.visible)
    .sort((left, right) => left.order - right.order);

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Workspace"
        title={dashboard.layout.name}
        actions={<Badge tone="info">{dashboard.generatedFor.roles.join(", ")}</Badge>}
      />

      {visibleWidgets.length === 0 ? (
        <EmptyState
          description="No widgets are visible for your current role and permissions."
          title="No dashboard widgets"
        />
      ) : (
        <section className="workspace-widget-grid" aria-label="Dashboard widgets">
          {visibleWidgets.map((widget) => (
            <Card className={`workspace-widget workspace-widget-${widget.size.toLowerCase()}`} key={widget.id}>
              <div className="workspace-widget-card">
                <div>
                  <span>{widget.widgetType.replaceAll("_", " ")}</span>
                  <strong>{widget.title}</strong>
                </div>
                <Badge tone={widgetToneByType[widget.widgetType] ?? "neutral"}>
                  {widget.size}
                </Badge>
              </div>
            </Card>
          ))}
        </section>
      )}

      <section className="content-panel">
        <div className="section-heading">
          <div>
            <p className="section-kicker">Navigation</p>
            <h2>Visible workspace modules</h2>
          </div>
          <Badge tone="neutral">{dashboard.navigation.length} modules</Badge>
        </div>

        {dashboard.navigation.length === 0 ? (
          <EmptyState title="No visible modules" />
        ) : (
          <div className="workspace-module-list">
            {dashboard.navigation.map((item) => (
              <div className="workspace-module-row" key={item.id}>
                <div>
                  <strong>{item.title}</strong>
                  <span>{item.module}</span>
                </div>
                <Badge tone="neutral">{item.permissionsRequired.join(", ") || "read"}</Badge>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="content-panel">
        <div className="section-heading">
          <div>
            <p className="section-kicker">Preferences</p>
            <h2>Workspace defaults</h2>
          </div>
          <Badge tone="neutral">{dashboard.preferences.language.toUpperCase()}</Badge>
        </div>

        <div className="workspace-preference-grid">
          <Card>
            <div className="metric-card">
              <span>Favorite modules</span>
              <strong>{dashboard.preferences.favoriteModules.length}</strong>
              <Badge tone="info">Saved</Badge>
            </div>
          </Card>
          <Card>
            <div className="metric-card">
              <span>Collapsed menus</span>
              <strong>{dashboard.preferences.collapsedMenus.length}</strong>
              <Badge tone="neutral">Placeholder</Badge>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}
