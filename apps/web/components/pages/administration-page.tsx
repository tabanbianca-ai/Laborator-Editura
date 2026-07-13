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
    role: "Creatorul platformei",
    access: "Acces nelimitat, separat de Administrator",
    tone: "success" as const
  },
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

const organizationManagement = {
  defaultType: "Persoană fizică",
  organizationTypes: [
    "Persoană fizică",
    "Editură",
    "Asociație / ONG",
    "Companie",
    "Instituție"
  ],
  defaultTeams: [
    "Echipa Traducere",
    "Echipa Revizie",
    "Echipa Machetare",
    "Echipa Ilustrații",
    "Echipa Multimedia",
    "Echipa Publicare",
    "Echipa Marketing",
    "Echipa Publicitate"
  ],
  teamScopes: ["Proiecte", "Task-uri", "Documente", "Responsabilități workflow"],
  creatorProtections: [
    "Nu poate fi eliminat",
    "Nu poate fi retrogradat",
    "Nu poate fi modificat de alți administratori",
    "Nu este disponibil pentru utilizatori obișnuiți",
    "Independent de abonament"
  ],
  auditActions: [
    "ADMIN_ORGANIZATION_CREATED",
    "ADMIN_ORGANIZATION_MODIFIED",
    "ADMIN_TEAM_CREATED",
    "ADMIN_TEAM_MODIFIED",
    "ADMIN_MEMBER_ADDED",
    "ADMIN_MEMBER_REMOVED",
    "ADMIN_PLATFORM_CREATOR_ACCESS"
  ]
};

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

const subscriptionPlans = [
  { plan: "FREE", status: "Current", tone: "info" as const },
  { plan: "BASIC", status: "Available", tone: "neutral" as const },
  { plan: "PREMIUM", status: "Available", tone: "neutral" as const },
  { plan: "BUSINESS", status: "Available", tone: "neutral" as const }
];

const subscriptionUsage = [
  { label: "Active projects", value: "1 / 1", warning: "Project limit reached" },
  { label: "Collaborators", value: "0 / 1", warning: "Collaborator quota guarded" },
  { label: "Storage", value: "128 MB / 512 MB", warning: "Storage quota tracked" },
  { label: "AI usage", value: "0 / 25", warning: "AI quota tracked" },
  { label: "Export entitlements", value: "JSON Master, PDF", warning: "Premium required for EPUB/MOBI/DOCX" }
];

const effectiveAccessRules = [
  "Role permissions",
  "Subscription entitlements",
  "Need-to-Know scope"
];

const aiProvidersCostManagement = {
  providers: [
    { provider: "OpenAI", role: "Primary", status: "Active", tone: "success" as const },
    { provider: "Anthropic", role: "Fallback", status: "Standby", tone: "info" as const }
  ],
  activeProvider: "OpenAI",
  fallbackStatus: "Anthropic fallback ready",
  modelSelection: "Automatic by default",
  manualModelSelection: "Role and subscription gated",
  monthlyBudget: "100 EUR",
  remainingBudget: "82 EUR",
  consumption: "18 EUR",
  warningThresholds: ["80%", "90%", "100%"],
  usageHistory: [
    "Translation Agent: 8 EUR",
    "Review Agent: 4 EUR",
    "Quality Agent: 3 EUR",
    "Research AI: 3 EUR"
  ],
  auditActions: [
    "AI_PROVIDER_CHANGED",
    "AI_FALLBACK_ACTIVATED",
    "AI_FALLBACK_RECOVERED",
    "AI_BUDGET_WARNING",
    "AI_BUDGET_EXCEEDED",
    "AI_ACTION_BLOCKED",
    "AI_SUBSCRIPTION_UPGRADED",
    "AI_SUBSCRIPTION_DOWNGRADED"
  ]
};

const centralLanguageManagement = {
  platformLanguage: "Romanian (ro-RO)",
  originalLanguage: "French (fr-FR)",
  authoringLanguage: "Romanian (ro-RO)",
  targetLanguages: ["English (en-US)", "Spanish (es-ES)", "Portuguese (pt-PT)", "Italian (it-IT)"],
  fallbackLanguage: "English (en-US)",
  translationCompleteness: ["Romanian 100%", "English 100%"],
  resources: [
    "Dictionaries by Source Language -> Target Language",
    "Glossaries by Source Language -> Target Language",
    "Terminology by Source Language -> Target Language",
    "Phraseology by Source Language -> Target Language"
  ],
  auditActions: [
    "PLATFORM_LANGUAGE_CHANGED",
    "ORIGINAL_LANGUAGE_CHANGED",
    "AUTHORING_LANGUAGE_CHANGED",
    "TARGET_LANGUAGE_ADDED",
    "TARGET_LANGUAGE_REMOVED",
    "LANGUAGE_RESOURCES_UPDATED"
  ]
};

const advancedLinguisticResources = {
  sourcePriority: [
    "Official normative source",
    "Project glossary",
    "Specialized glossary",
    "Translation Memory",
    "Bilingual dictionary",
    "Explanatory dictionary",
    "Corpus/examples"
  ],
  glossaryHierarchy: ["Project Glossary", "Platform Glossary", "Personal Glossary suggestions"],
  proposalSignals: [
    "Confidence score",
    "Consulted sources",
    "Glossary used",
    "Translation Memory match",
    "Terminology status",
    "Semantic validation",
    "Explanation"
  ],
  auditActions: [
    "GLOSSARY_CREATED",
    "GLOSSARY_UPDATED",
    "GLOSSARY_CONFLICT",
    "TRANSLATION_MEMORY_ENTRY_ADDED",
    "TRANSLATION_MEMORY_REUSED",
    "SOURCE_PRIORITY_CHANGED",
    "CONFIDENCE_RECALCULATED"
  ]
};

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

          <section className="status-grid" aria-label="Users roles and subscription usage">
            <div className="content-panel">
              <div className="section-heading">
                <div>
                  <p className="section-kicker">Users and Roles</p>
                  <h2>Roluri operaționale, separate de abonament</h2>
                </div>
                <Badge tone="success">Role-based</Badge>
              </div>
              <div className="stack-list">
                {roleAccess.map((item) => (
                  <div className="signal-row" key={item.role}>
                    <span>{item.role}</span>
                    <Badge tone={item.tone}>{item.access}</Badge>
                  </div>
                ))}
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

            <div className="content-panel">
              <div className="section-heading">
                <div>
                  <p className="section-kicker">Subscription and Usage</p>
                  <h2>Planuri comerciale, cote și limitări</h2>
                </div>
                <Badge tone="info">Not roles</Badge>
              </div>
              <div className="admin-plan-list" aria-label="Subscription plans">
                {subscriptionPlans.map((plan) => (
                  <div className="signal-row" key={plan.plan}>
                    <span>{plan.plan}</span>
                    <Badge tone={plan.tone}>{plan.status}</Badge>
                  </div>
                ))}
              </div>
              <div className="stack-list" aria-label="Subscription usage and quota warnings">
                {subscriptionUsage.map((item) => (
                  <div className="signal-row" key={item.label}>
                    <span>{item.label}</span>
                    <Badge tone={item.warning.includes("required") || item.warning.includes("reached") ? "warning" : "info"}>
                      {item.value}
                    </Badge>
                  </div>
                ))}
              </div>
              <div className="admin-access-formula" aria-label="Effective access formula">
                <strong>Effective access</strong>
                <span>{effectiveAccessRules.join(" × ")}</span>
              </div>
              <div className="page-header-actions admin-subscription-actions">
                <Button disabled variant="secondary">Upgrade plan</Button>
                <Button disabled variant="ghost">Downgrade plan</Button>
              </div>
            </div>
          </section>

          <section className="content-panel" aria-label="AI Providers and Cost Management">
            <div className="section-heading">
              <div>
                <p className="section-kicker">AI Providers & Cost Management</p>
                <h2>OpenAI primar, Anthropic fallback și bugete AI</h2>
              </div>
              <Badge tone="success">Provider fallback ready</Badge>
            </div>
            <div className="admin-language-grid">
              <div className="stack-list">
                <strong>Configured providers</strong>
                {aiProvidersCostManagement.providers.map((provider) => (
                  <div className="signal-row" key={provider.provider}>
                    <span>{provider.provider} - {provider.role}</span>
                    <Badge tone={provider.tone}>{provider.status}</Badge>
                  </div>
                ))}
                <div className="signal-row">
                  <span>Active provider</span>
                  <Badge tone="success">{aiProvidersCostManagement.activeProvider}</Badge>
                </div>
                <div className="signal-row">
                  <span>Fallback status</span>
                  <Badge tone="info">{aiProvidersCostManagement.fallbackStatus}</Badge>
                </div>
              </div>
              <div className="stack-list">
                <strong>Model selection and budget</strong>
                <div className="signal-row">
                  <span>{aiProvidersCostManagement.modelSelection}</span>
                  <Badge tone="info">Automatic</Badge>
                </div>
                <div className="signal-row">
                  <span>{aiProvidersCostManagement.manualModelSelection}</span>
                  <Badge tone="warning">Advanced only</Badge>
                </div>
                <div className="signal-row">
                  <span>Monthly budget</span>
                  <Badge tone="info">{aiProvidersCostManagement.monthlyBudget}</Badge>
                </div>
                <div className="signal-row">
                  <span>Remaining budget</span>
                  <Badge tone="success">{aiProvidersCostManagement.remainingBudget}</Badge>
                </div>
                <div className="signal-row">
                  <span>Consumption</span>
                  <Badge tone="neutral">{aiProvidersCostManagement.consumption}</Badge>
                </div>
              </div>
              <div className="stack-list">
                <strong>Warning thresholds</strong>
                <div className="admin-config-items" aria-label="AI cost warning thresholds">
                  {aiProvidersCostManagement.warningThresholds.map((threshold) => (
                    <span key={threshold}>{threshold}</span>
                  ))}
                </div>
                <strong>AI usage history</strong>
                <div className="admin-config-items" aria-label="AI usage history">
                  {aiProvidersCostManagement.usageHistory.map((entry) => (
                    <span key={entry}>{entry}</span>
                  ))}
                </div>
                <strong>Audit</strong>
                <div className="admin-config-items" aria-label="AI provider and cost audit actions">
                  {aiProvidersCostManagement.auditActions.map((action) => (
                    <span key={action}>{action}</span>
                  ))}
                </div>
              </div>
            </div>
            <div className="blocking-warning" role="status">
              Platform Creator has unlimited AI access and testing capacity.
              Subscription limits never delete data; they block only the
              restricted AI action until reset or upgrade.
            </div>
          </section>

          <section className="content-panel" aria-label="Organization Management">
            <div className="section-heading">
              <div>
                <p className="section-kicker">Organization Management</p>
                <h2>Organizație, echipe și Creatorul platformei</h2>
              </div>
              <Badge tone="success">Audit enabled</Badge>
            </div>
            <div className="admin-language-grid">
              <div className="stack-list">
                <strong>Tip organizație</strong>
                <div className="signal-row">
                  <span>Implicit</span>
                  <Badge tone="info">{organizationManagement.defaultType}</Badge>
                </div>
                <div className="admin-config-items" aria-label="Organization types">
                  {organizationManagement.organizationTypes.map((type) => (
                    <span key={type}>{type}</span>
                  ))}
                </div>
                <strong>Scop echipe</strong>
                <div className="admin-config-items" aria-label="Team assignment scopes">
                  {organizationManagement.teamScopes.map((scope) => (
                    <span key={scope}>{scope}</span>
                  ))}
                </div>
              </div>
              <div className="stack-list">
                <strong>Dosare de echipă implicite</strong>
                <div className="admin-config-items" aria-label="Default organization teams">
                  {organizationManagement.defaultTeams.map((team) => (
                    <span key={team}>{team}</span>
                  ))}
                </div>
              </div>
              <div className="stack-list">
                <strong>Creatorul platformei</strong>
                {organizationManagement.creatorProtections.map((rule) => (
                  <div className="signal-row" key={rule}>
                    <span>{rule}</span>
                    <Badge tone="success">Protected</Badge>
                  </div>
                ))}
                <strong>Audit</strong>
                <div className="admin-config-items" aria-label="Organization audit actions">
                  {organizationManagement.auditActions.map((action) => (
                    <span key={action}>{action}</span>
                  ))}
                </div>
              </div>
            </div>
            <div className="blocking-warning" role="status">
              Creatorul platformei este rol de sistem unic pentru proprietarul
              platformei. Este complet separat de Administrator și nu poate fi
              atribuit utilizatorilor obișnuiți.
            </div>
          </section>

          <section className="content-panel" aria-label="Central Language Management">
            <div className="section-heading">
              <div>
                <p className="section-kicker">Central Language Management</p>
                <h2>Un singur model pentru toate limbile platformei</h2>
              </div>
              <Badge tone="success">No duplicate settings</Badge>
            </div>
            <div className="admin-language-grid">
              <div className="stack-list">
                <div className="signal-row">
                  <span>Platform Language</span>
                  <Badge tone="info">{centralLanguageManagement.platformLanguage}</Badge>
                </div>
                <div className="signal-row">
                  <span>Original Language</span>
                  <Badge tone="warning">{centralLanguageManagement.originalLanguage}</Badge>
                </div>
                <div className="signal-row">
                  <span>Authoring Language</span>
                  <Badge tone="success">{centralLanguageManagement.authoringLanguage}</Badge>
                </div>
                <div className="signal-row">
                  <span>Language fallback</span>
                  <Badge tone="neutral">{centralLanguageManagement.fallbackLanguage}</Badge>
                </div>
              </div>
              <div className="stack-list">
                <strong>Target Languages</strong>
                <div className="admin-config-items" aria-label="Target Languages">
                  {centralLanguageManagement.targetLanguages.map((language) => (
                    <span key={language}>{language}</span>
                  ))}
                </div>
                <strong>Automatic linguistic resources</strong>
                <div className="admin-config-items" aria-label="Source Language to Target Language resources">
                  {centralLanguageManagement.resources.map((resource) => (
                    <span key={resource}>{resource}</span>
                  ))}
                </div>
              </div>
              <div className="stack-list">
                <strong>Translation completeness</strong>
                {centralLanguageManagement.translationCompleteness.map((item) => (
                  <div className="signal-row" key={item}>
                    <span>{item}</span>
                    <Badge tone="success">Complete</Badge>
                  </div>
                ))}
                <strong>Audit</strong>
                <div className="admin-config-items" aria-label="Language audit actions">
                  {centralLanguageManagement.auditActions.map((action) => (
                    <span key={action}>{action}</span>
                  ))}
                </div>
              </div>
            </div>
            <div className="blocking-warning" role="status">
              Changing Platform Language updates menus, administration, dashboard,
              workflow names, AI conversations and workspace labels only. It does
              not change Original Language, Authoring Language or Target Language.
            </div>
          </section>

          <section className="content-panel" aria-label="Advanced Linguistic Resources and Translation Memory">
            <div className="section-heading">
              <div>
                <p className="section-kicker">Resurse lingvistice avansate</p>
                <h2>Prioritate surse, glosare și Translation Memory</h2>
              </div>
              <Badge tone="success">Integrated</Badge>
            </div>
            <div className="admin-language-grid">
              <div className="stack-list">
                <strong>Source priority</strong>
                {advancedLinguisticResources.sourcePriority.map((source, index) => (
                  <div className="signal-row" key={source}>
                    <span>{index + 1}. {source}</span>
                    <Badge tone="info">Drag/drop order</Badge>
                  </div>
                ))}
              </div>
              <div className="stack-list">
                <strong>Glossary hierarchy</strong>
                <div className="admin-config-items" aria-label="Glossary hierarchy">
                  {advancedLinguisticResources.glossaryHierarchy.map((item) => (
                    <span key={item}>{item}</span>
                  ))}
                </div>
                <strong>Proposal transparency</strong>
                <div className="admin-config-items" aria-label="Linguistic proposal transparency">
                  {advancedLinguisticResources.proposalSignals.map((signal) => (
                    <span key={signal}>{signal}</span>
                  ))}
                </div>
              </div>
              <div className="stack-list">
                <strong>Audit events</strong>
                <div className="admin-config-items" aria-label="Advanced linguistic audit actions">
                  {advancedLinguisticResources.auditActions.map((action) => (
                    <span key={action}>{action}</span>
                  ))}
                </div>
                <div className="blocking-warning" role="status">
                  Translation Memory never replaces text automatically. It proposes
                  only validated entries, and conflicting glossary evidence requires
                  human review.
                </div>
              </div>
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
