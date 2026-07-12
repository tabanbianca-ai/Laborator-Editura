import {
  Badge,
  Button,
  Card,
  EmptyState,
  ErrorState,
  LoadingState,
  PageHeader,
  Table
} from "../ui";

type AdminViewState = "ready" | "empty" | "loading" | "error";

const ADMIN_NAVIGATION_LEVELS = 2;

const configurationSections = [
  {
    id: "organization",
    title: "Organizație",
    description: "Date organizație, logo, branding, fus orar și monedă.",
    items: ["Date organizație", "Logo", "Branding", "Fus orar", "Monedă"],
    status: "Ready",
    critical: false
  },
  {
    id: "users",
    title: "Utilizatori",
    description: "Utilizatori, invitații, echipe și grupuri.",
    items: ["Utilizatori", "Invitații", "Echipe", "Grupuri"],
    status: "Ready",
    critical: false
  },
  {
    id: "roles-permissions",
    title: "Roluri și permisiuni",
    description: "Roluri, permisiuni, politici Need-to-Know și acces temporar.",
    items: ["Roluri", "Permisiuni", "Politici Need-to-Know", "Acces temporar"],
    status: "Confirmation required",
    critical: true
  },
  {
    id: "ai-agents",
    title: "Agenți AI",
    description: "Activare, priorități, modele AI, limite, costuri și monitorizare.",
    items: ["Activare/dezactivare", "Priorități", "Modele AI", "Limite", "Costuri", "Monitorizare"],
    status: "Governed",
    critical: true
  },
  {
    id: "linguistic-resources",
    title: "Resurse lingvistice",
    description: "Limbi, dicționare, glosare, surse aprobate și actualizări.",
    items: ["Limbi", "Dicționare", "Glosare", "Surse aprobate", "Actualizări"],
    status: "Ready",
    critical: false
  },
  {
    id: "editorial-templates",
    title: "Șabloane editoriale",
    description: "Formate carte, formate revistă, stiluri, șabloane și exporturi.",
    items: ["Formate carte", "Formate revistă", "Stiluri", "Șabloane", "Exporturi"],
    status: "Ready",
    critical: false
  },
  {
    id: "publishing-distribution",
    title: "Publicare și distribuție",
    description: "ISBN, marketplace, canale și profiluri export.",
    items: ["ISBN", "Marketplace", "Canale", "Profiluri export"],
    status: "Confirmation required",
    critical: true
  },
  {
    id: "security",
    title: "Securitate",
    description: "Autentificare, MFA, sesiuni și chei API.",
    items: ["Autentificare", "MFA", "Sesiuni", "Chei API"],
    status: "Confirmation required",
    critical: true
  },
  {
    id: "audit-backup",
    title: "Audit și backup",
    description: "Audit, backup, restaurare și retenție.",
    items: ["Audit", "Backup", "Restaurare", "Retenție"],
    status: "Ready",
    critical: false
  },
  {
    id: "integrations",
    title: "Integrări",
    description: "AI, Email, Cloud și API.",
    items: ["AI", "Email", "Cloud", "API"],
    status: "Governed",
    critical: true
  },
  {
    id: "system",
    title: "Sistem",
    description: "Actualizări, versiuni, diagnostic și sănătatea platformei.",
    items: ["Actualizări", "Versiuni", "Diagnostic", "Sănătatea platformei"],
    status: "Readiness",
    critical: true
  }
] as const;

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
    email: "ops-admin@example.com",
    id: "user-002",
    organization: "MVP Organization",
    roles: ["ADMIN"],
    status: "Active",
    tenant: "tenant-mvp"
  },
  {
    email: "beta-admin@example.com",
    id: "user-003",
    organization: "Closed Beta",
    roles: ["ADMIN"],
    status: "Invited",
    tenant: "tenant-beta"
  }
];

const roleAccess = [
  {
    role: "Administrator",
    access: "Vede toate secțiunile",
    tone: "success" as const
  },
  {
    role: "Editor",
    access: "Nu intră în Administrare",
    tone: "neutral" as const
  },
  {
    role: "Reviewer / Translator / Author",
    access: "Lucrează în workspace-urile de producție, nu în Administrare",
    tone: "neutral" as const
  }
];

const auditLogs = [
  {
    actor: "admin@example.com",
    event: "Updated platform configuration",
    id: "audit-001",
    scope: "Administration Center",
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
    actor: "admin@example.com",
    event: "Reviewed critical change confirmation",
    id: "audit-003",
    scope: "Roles and permissions",
    timestamp: "2026-06-13 12:31"
  }
];

const governanceSignals = [
  { label: "Maximum navigation depth", status: `${ADMIN_NAVIGATION_LEVELS} levels`, tone: "success" as const },
  { label: "Duplicate options", status: "Removed", tone: "success" as const },
  { label: "Critical changes", status: "Require confirmation", tone: "warning" as const },
  { label: "Change history", status: "Reversible and audited", tone: "info" as const }
];

function getAdminViewState(): AdminViewState {
  return "ready";
}

function getStatusTone(status: string) {
  if (status === "Ready" || status === "Readiness") {
    return "success";
  }

  if (status === "Confirmation required") {
    return "warning";
  }

  return "info";
}

export function AdministrationPage() {
  const currentViewState = getAdminViewState();

  return (
    <div className="page-stack admin-configuration-center">
      <PageHeader
        actions={
          <>
            <Button disabled variant="secondary">
              Preview audited change
            </Button>
            <Button disabled>
              Confirm critical change
            </Button>
          </>
        }
        eyebrow="Administrare"
        title="Centru de configurare a platformei"
      />

      <section className="content-panel">
        <div className="section-heading">
          <div>
            <p className="section-kicker">Principiu</p>
            <h2>Configurare rară, lucru zilnic în workspace-uri</h2>
          </div>
          <Badge tone="info">Admin only</Badge>
        </div>
        <div className="admin-guidance-grid">
          <p>
            Administrarea este locul pentru configurarea platformei, nu pentru
            activitatea editorială zilnică. Editorii, traducătorii, autorii și
            reviewerii lucrează în Pipeline, Editorial Workspace și modulele de
            producție.
          </p>
          <div className="stack-list">
            {governanceSignals.map((signal) => (
              <div className="signal-row" key={signal.label}>
                <span>{signal.label}</span>
                <Badge tone={signal.tone}>{signal.status}</Badge>
              </div>
            ))}
          </div>
        </div>
      </section>

      {currentViewState === "loading" ? (
        <LoadingState label="Loading administration configuration" />
      ) : null}
      {currentViewState === "error" ? (
        <ErrorState message="Administration configuration could not be loaded." />
      ) : null}
      {currentViewState === "empty" ? <EmptyState title="No administration configuration" /> : null}

      {currentViewState === "ready" ? (
        <>
          <section className="admin-section-grid" aria-label="Administration configuration sections">
            {configurationSections.map((section) => (
              <Card
                className={section.critical ? "admin-config-card admin-config-card-critical" : "admin-config-card"}
                key={section.id}
                title={section.title}
              >
                <p>{section.description}</p>
                <div className="admin-config-items" aria-label={`${section.title} settings`}>
                  {section.items.map((item) => (
                    <span key={`${section.id}-${item}`}>{item}</span>
                  ))}
                </div>
                <div className="admin-config-footer">
                  <Badge tone={getStatusTone(section.status)}>{section.status}</Badge>
                  <span>{section.critical ? "Confirmare obligatorie" : "Audit automat"}</span>
                </div>
              </Card>
            ))}
          </section>

          <section className="status-grid" aria-label="Administration access and users">
            <div className="content-panel">
              <div className="section-heading">
                <div>
                  <p className="section-kicker">Acces pe rol</p>
                  <h2>Administratorii configurează, editorii nu intră în Administrare</h2>
                </div>
              </div>
              <div className="stack-list">
                {roleAccess.map((item) => (
                  <div className="signal-row" key={item.role}>
                    <span>{item.role}</span>
                    <Badge tone={item.tone}>{item.access}</Badge>
                  </div>
                ))}
              </div>
            </div>

            <div className="content-panel">
              <div className="section-heading">
                <div>
                  <p className="section-kicker">Utilizatori</p>
                  <h2>Administratori și invitații</h2>
                </div>
                <Badge tone="neutral">{users.length} records</Badge>
              </div>
              <Table ariaLabel="Administration users and roles">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Roles</th>
                    <th>Organization</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td>{user.email}</td>
                      <td>{user.roles.join(", ")}</td>
                      <td>{user.organization}</td>
                      <td>
                        <Badge tone={user.status === "Active" ? "success" : "warning"}>
                          {user.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </section>

          <section className="status-grid" aria-label="Audit and critical safeguards">
            <div className="content-panel">
              <div className="section-heading">
                <div>
                  <p className="section-kicker">Audit</p>
                  <h2>Toate modificările sunt auditate</h2>
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
                  <p className="section-kicker">Confirmare</p>
                  <h2>Nicio modificare critică fără confirmare</h2>
                </div>
              </div>
              <div className="stack-list">
                <div className="blocking-warning" role="status">
                  Schimbările critice pentru roluri, securitate, agenți AI,
                  publicare, integrări și sistem trebuie confirmate explicit.
                </div>
                <div className="signal-row">
                  <span>Reversibilitate</span>
                  <Badge tone="success">Enabled by audit trail</Badge>
                </div>
                <div className="signal-row">
                  <span>Need-to-Know</span>
                  <Badge tone="info">Server-side policy</Badge>
                </div>
              </div>
            </div>
          </section>
        </>
      ) : null}
    </div>
  );
}
