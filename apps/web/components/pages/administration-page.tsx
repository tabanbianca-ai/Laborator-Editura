import {
  Badge,
  EmptyState,
  ErrorState,
  LoadingState,
  Table
} from "../ui";

type AdminViewState = "ready" | "empty" | "loading" | "error";

const users = [
  {
    email: "admin@example.com",
    id: "user-001",
    organization: "MVP Organization",
    roles: ["ADMIN", "REVIEWER"],
    status: "Active",
    tenant: "tenant-mvp"
  },
  {
    email: "translator@example.com",
    id: "user-002",
    organization: "MVP Organization",
    roles: ["TRANSLATOR"],
    status: "Active",
    tenant: "tenant-mvp"
  },
  {
    email: "viewer@example.com",
    id: "user-003",
    organization: "Closed Beta",
    roles: ["VIEWER"],
    status: "Invited",
    tenant: "tenant-beta"
  }
];

const auditLogs = [
  {
    actor: "admin@example.com",
    event: "Approved document",
    id: "audit-001",
    scope: "Spiritism Translation MVP",
    timestamp: "2026-06-13 12:10"
  },
  {
    actor: "system",
    event: "Backup dry-run completed",
    id: "audit-002",
    scope: "Runtime database",
    timestamp: "2026-06-13 12:20"
  },
  {
    actor: "reviewer@example.com",
    event: "Blocked workflow transition",
    id: "audit-003",
    scope: "Terminology Appendix",
    timestamp: "2026-06-13 12:31"
  }
];

const operationalStatuses = [
  { label: "Backup status", status: "Dry-run ready", tone: "success" as const },
  { label: "Restore status", status: "Validation required", tone: "warning" as const },
  { label: "Release status", status: "Closed beta ready", tone: "info" as const },
  { label: "Staging status", status: "Configuration prepared", tone: "info" as const }
];

const platformSupport = [
  { label: "Desktop", status: "Windows / macOS / Linux", tone: "success" as const },
  { label: "Mobile", status: "Android / iOS", tone: "success" as const },
  { label: "Tablet", status: "iPadOS / Android", tone: "success" as const },
  { label: "PWA", status: "Installable target", tone: "info" as const }
];

const securityWarnings = [
  "Privileged changes require server-side authorization.",
  "Request context must be server-derived.",
  "Tenant isolation is pending staging validation."
];

function getAdminViewState(): AdminViewState {
  return "ready";
}

export function AdministrationPage() {
  const currentViewState = getAdminViewState();

  return (
    <div className="page-stack">
      <section className="content-panel">
        <div className="section-heading">
          <div>
            <p className="section-kicker">Administration</p>
            <h2>Users and tenants</h2>
          </div>
          <Badge tone="info">{users.length} users</Badge>
        </div>

        {currentViewState === "loading" ? (
          <LoadingState label="Loading administration" />
        ) : null}
        {currentViewState === "error" ? (
          <ErrorState message="Administration data could not be loaded." />
        ) : null}
        {currentViewState === "empty" ? <EmptyState title="No users" /> : null}
        {currentViewState === "ready" ? (
          <Table ariaLabel="Users and roles">
            <thead>
              <tr>
                <th>User</th>
                <th>Roles</th>
                <th>Organization</th>
                <th>Tenant</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.email}</td>
                  <td>{user.roles.join(", ")}</td>
                  <td>{user.organization}</td>
                  <td>{user.tenant}</td>
                  <td>
                    <Badge tone={user.status === "Active" ? "success" : "warning"}>
                      {user.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : null}
      </section>

      <section className="status-grid" aria-label="Administration status">
        <div className="content-panel">
          <div className="section-heading">
            <div>
              <p className="section-kicker">Operations</p>
              <h2>Backup and release status</h2>
            </div>
          </div>
          <div className="stack-list">
            {operationalStatuses.map((item) => (
              <div className="signal-row" key={item.label}>
                <span>{item.label}</span>
                <Badge tone={item.tone}>{item.status}</Badge>
              </div>
            ))}
          </div>
        </div>

        <div className="content-panel">
          <div className="section-heading">
            <div>
              <p className="section-kicker">Platform support</p>
              <h2>Supported targets</h2>
            </div>
          </div>
          <div className="stack-list">
            {platformSupport.map((item) => (
              <div className="signal-row" key={item.label}>
                <span>{item.label}</span>
                <Badge tone={item.tone}>{item.status}</Badge>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="status-grid" aria-label="Audit and security">
        <div className="content-panel">
          <div className="section-heading">
            <div>
              <p className="section-kicker">Audit logs</p>
              <h2>Preview</h2>
            </div>
          </div>
          <div className="timeline-list">
            {auditLogs.map((log) => (
              <article className="timeline-item" key={log.id}>
                <Badge tone="info">{log.actor}</Badge>
                <div>
                  <strong>{log.event}</strong>
                  <p>
                    {log.scope} - {log.timestamp}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="content-panel">
          <div className="section-heading">
            <div>
              <p className="section-kicker">Security</p>
              <h2>Warning states</h2>
            </div>
          </div>
          <div className="stack-list">
            {securityWarnings.map((warning) => (
              <div className="blocking-warning" key={warning} role="status">
                {warning}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
