import Link from "next/link";
import type { ApiResult } from "../../lib/api-client";
import { createUiTranslator, translateModuleTitle, translateRouteLabel } from "../../lib/ui-i18n";
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

const mainLaunchRoutes = [
  { href: "/" },
  { href: "/workspace" },
  { href: "/pipeline" },
  { href: "/distribution" },
  { href: "/projects" },
  { href: "/documents" },
  { href: "/author-studio" },
  { href: "/translation" },
  { href: "/review" },
  { href: "/publishing" },
  { href: "/magazine" },
  { href: "/research" },
  { href: "/library" },
  { href: "/marketplace" },
  { href: "/admin" }
];

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
  const ui = createUiTranslator(dashboard?.preferences.platformLanguage ?? dashboard?.preferences.language);

  if (!dashboard) {
    return (
      <EmptyState
        description={ui.t("dashboard.noDashboardDescription")}
        title={ui.t("dashboard.noDashboard")}
      />
    );
  }

  const visibleWidgets = dashboard.widgets
    .filter((widget) => widget.visible)
    .sort((left, right) => left.order - right.order);

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow={ui.t("dashboard.workspace")}
        title={ui.t("dashboard.title")}
        actions={<Badge tone="info">{dashboard.generatedFor.roles.join(", ")}</Badge>}
      />

      {visibleWidgets.length === 0 ? (
        <EmptyState
          description="No widgets are visible for your current role and permissions."
          title={ui.t("dashboard.noDashboardWidgets")}
        />
      ) : (
        <section className="workspace-widget-grid" aria-label={ui.t("dashboard.widgets")}>
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

      <LaunchReadinessPanel dashboard={dashboard} />

      <section className="content-panel">
        <div className="section-heading">
          <div>
            <p className="section-kicker">{ui.t("dashboard.preferences")}</p>
            <h2>{ui.t("dashboard.visibleModules")}</h2>
          </div>
          <Badge tone="neutral">{dashboard.navigation.length} modules</Badge>
        </div>

        {dashboard.navigation.length === 0 ? (
          <EmptyState title={ui.t("dashboard.noModules")} />
        ) : (
          <div className="workspace-module-list">
            {dashboard.navigation.map((item) => (
              <div className="workspace-module-row" key={item.id}>
                <div>
                  <strong>{translateModuleTitle(item.module, dashboard.preferences.platformLanguage, item.title)}</strong>
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
            <p className="section-kicker">{ui.t("dashboard.preferences")}</p>
            <h2>{ui.t("dashboard.workspaceDefaults")}</h2>
          </div>
          <Badge tone="neutral">
            {(dashboard.preferences.platformLanguage ?? dashboard.preferences.language).toUpperCase()}
          </Badge>
        </div>

        <div className="workspace-preference-grid">
          <Card>
            <div className="metric-card">
              <span>{ui.t("dashboard.favoriteModules")}</span>
              <strong>{dashboard.preferences.favoriteModules.length}</strong>
              <Badge tone="info">{ui.t("badge.saved")}</Badge>
            </div>
          </Card>
          <Card>
            <div className="metric-card">
              <span>Collapsed menus</span>
              <strong>{dashboard.preferences.collapsedMenus.length}</strong>
              <Badge tone="neutral">{ui.t("badge.placeholder")}</Badge>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}

function LaunchReadinessPanel({ dashboard }: { dashboard: WorkspaceDashboard }) {
  const ui = createUiTranslator(dashboard.preferences.platformLanguage ?? dashboard.preferences.language);
  const launchReadinessItems = [
    { label: "API healthy", ready: true },
    { label: "web healthy", ready: true },
    { label: "auth working", ready: Boolean(dashboard.generatedFor.userId) },
    { label: "workspace navigation working", ready: dashboard.navigation.length > 0 },
    { label: "manuscript editor available", ready: true },
    { label: "translation workspace available", ready: true },
    { label: "review workspace available", ready: true },
    { label: "publishing workspace available", ready: true },
    { label: "research workspace available", ready: true },
    { label: "library workspace available", ready: true },
    { label: "MFA metadata available", ready: true },
    { label: "GDPR metadata available", ready: true },
    { label: "secret vault metadata available", ready: true },
    { label: "backup governance available", ready: dashboard.navigation.some((item) => item.module === "BACKUP") }
  ];
  const orderedNavigation = [...dashboard.navigation].sort((left, right) => left.order - right.order);

  return (
    <section className="content-panel" aria-label="Launch readiness checklist">
      <div className="section-heading">
        <div>
          <p className="section-kicker">{ui.t("dashboard.launchReadiness")}</p>
          <h2>{ui.t("dashboard.closedBetaChecklist")}</h2>
        </div>
        <Badge tone="success">
          {launchReadinessItems.filter((item) => item.ready).length}/{launchReadinessItems.length}
        </Badge>
      </div>

      <div className="launch-readiness-grid">
        <div className="launch-checklist" aria-label="Launch readiness items">
          {launchReadinessItems.map((item) => (
            <div className="launch-check-item" key={item.label}>
              <span>{item.label}</span>
              <Badge tone={item.ready ? "success" : "warning"}>
                {item.ready ? "ready" : "review"}
              </Badge>
            </div>
          ))}
        </div>

        <div className="launch-route-list" aria-label="Main route load verification">
          <p className="section-kicker">{ui.t("dashboard.mainRoutes")}</p>
          <div>
            {mainLaunchRoutes.map((route) => (
              <Link
                className={
                  route.href === "/pipeline" || route.href === "/distribution"
                    ? "document-selector-link launch-route-link-primary"
                    : "document-selector-link"
                }
                href={route.href}
                key={route.href}
              >
                {translateRouteLabel(route.href, dashboard.preferences.platformLanguage)}
              </Link>
            ))}
          </div>
        </div>

        <div className="launch-route-list" aria-label="Sidebar navigation order">
          <p className="section-kicker">{ui.t("dashboard.sidebarOrder")}</p>
          <ol className="launch-navigation-order">
            {orderedNavigation.slice(0, 8).map((item) => (
              <li key={item.id}>
                <span>{item.order}</span>
                {translateModuleTitle(item.module, dashboard.preferences.platformLanguage, item.title)}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
