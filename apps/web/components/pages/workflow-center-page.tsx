import {
  Badge,
  Card,
  EmptyState,
  ErrorState,
  LoadingState,
  Table
} from "../ui";

type WorkflowStatus =
  | "DRAFT"
  | "IN_TRANSLATION"
  | "IN_QA"
  | "IN_SEMANTIC_REVIEW"
  | "IN_REVIEW"
  | "APPROVED"
  | "READY_FOR_EXPORT"
  | "EXPORTED"
  | "BLOCKED";
type WorkflowViewState = "ready" | "empty" | "loading" | "error";

interface WorkflowDocument {
  blockedReason?: string;
  document: string;
  id: string;
  owner: string;
  project: string;
  status: WorkflowStatus;
}

interface TimelineItem {
  actor: string;
  event: string;
  id: string;
  status: WorkflowStatus;
  timestamp: string;
}

const workflowDocuments: WorkflowDocument[] = [
  {
    document: "Sample Document",
    id: "workflow-doc-001",
    owner: "Senior Reviewer",
    project: "Spiritism Translation MVP",
    status: "IN_REVIEW"
  },
  {
    blockedReason: "Unresolved CRITICAL QA issue in Segment 8.",
    document: "Terminology Appendix",
    id: "workflow-doc-002",
    owner: "MVP Translator",
    project: "Philosophy Corpus",
    status: "BLOCKED"
  },
  {
    document: "JSON Master Export",
    id: "workflow-doc-003",
    owner: "Admin",
    project: "Closed Beta",
    status: "READY_FOR_EXPORT"
  }
];

const workflowTimeline: TimelineItem[] = [
  {
    actor: "MVP Translator",
    event: "Translation completed",
    id: "timeline-001",
    status: "IN_QA",
    timestamp: "2026-06-13 09:20"
  },
  {
    actor: "QA Reviewer",
    event: "QA run completed",
    id: "timeline-002",
    status: "IN_SEMANTIC_REVIEW",
    timestamp: "2026-06-13 10:05"
  },
  {
    actor: "Senior Reviewer",
    event: "Semantic review requested",
    id: "timeline-003",
    status: "IN_REVIEW",
    timestamp: "2026-06-13 10:48"
  }
];

const workflowStatuses: WorkflowStatus[] = [
  "DRAFT",
  "IN_TRANSLATION",
  "IN_QA",
  "IN_SEMANTIC_REVIEW",
  "IN_REVIEW",
  "APPROVED",
  "READY_FOR_EXPORT",
  "EXPORTED",
  "BLOCKED"
];

const approvalGates = [
  { label: "QA gate", status: "Blocked", tone: "danger" as const },
  { label: "Semantic gate", status: "Needs review", tone: "warning" as const },
  { label: "Human approval", status: "Reviewer only", tone: "info" as const },
  { label: "Export gate", status: "Waiting", tone: "neutral" as const }
];

const rolePermissions = [
  { label: "Translator", permission: "Can submit translation", tone: "success" as const },
  { label: "Reviewer", permission: "Can approve review", tone: "success" as const },
  { label: "Admin", permission: "Can mark ready for export", tone: "success" as const },
  { label: "AI", permission: "Cannot approve", tone: "danger" as const }
];

function getWorkflowViewState(): WorkflowViewState {
  return "ready";
}

function getWorkflowTone(status: WorkflowStatus) {
  if (status === "APPROVED" || status === "READY_FOR_EXPORT" || status === "EXPORTED") {
    return "success";
  }

  if (status === "BLOCKED") {
    return "danger";
  }

  if (status === "IN_QA" || status === "IN_SEMANTIC_REVIEW" || status === "IN_REVIEW") {
    return "warning";
  }

  return "info";
}

export function WorkflowCenterPage() {
  const currentViewState = getWorkflowViewState();
  const blockedDocuments = workflowDocuments.filter(
    (document) => document.status === "BLOCKED"
  );
  const pendingReviews = workflowDocuments.filter(
    (document) => document.status === "IN_REVIEW"
  );

  return (
    <div className="page-stack">
      <section className="metric-grid" aria-label="Workflow status overview">
        <Card>
          <div className="metric-card">
            <span>Pending reviews</span>
            <strong>{pendingReviews.length}</strong>
            <Badge tone="warning">Workflow</Badge>
          </div>
        </Card>
        <Card>
          <div className="metric-card">
            <span>Blocked documents</span>
            <strong>{blockedDocuments.length}</strong>
            <Badge tone="danger">Blocked</Badge>
          </div>
        </Card>
        <Card>
          <div className="metric-card">
            <span>Ready for export</span>
            <strong>1</strong>
            <Badge tone="success">Ready</Badge>
          </div>
        </Card>
        <Card>
          <div className="metric-card">
            <span>Approval gates</span>
            <strong>{approvalGates.length}</strong>
            <Badge tone="info">Gated</Badge>
          </div>
        </Card>
      </section>

      <section className="content-panel">
        <div className="section-heading">
          <div>
            <p className="section-kicker">Workflow Center</p>
            <h2>Status overview</h2>
          </div>
          <Badge tone="info">{workflowDocuments.length} documents</Badge>
        </div>

        {currentViewState === "loading" ? (
          <LoadingState label="Loading workflow" />
        ) : null}
        {currentViewState === "error" ? (
          <ErrorState message="Workflow status could not be loaded." />
        ) : null}
        {currentViewState === "empty" ? <EmptyState title="No workflow items" /> : null}
        {currentViewState === "ready" ? (
          <Table ariaLabel="Workflow documents">
            <thead>
              <tr>
                <th>Document</th>
                <th>Project</th>
                <th>Owner</th>
                <th>Status</th>
                <th>Blocked reason</th>
              </tr>
            </thead>
            <tbody>
              {workflowDocuments.map((document) => (
                <tr key={document.id}>
                  <td>{document.document}</td>
                  <td>{document.project}</td>
                  <td>{document.owner}</td>
                  <td>
                    <Badge tone={getWorkflowTone(document.status)}>
                      {document.status}
                    </Badge>
                  </td>
                  <td>{document.blockedReason ?? "None"}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : null}
      </section>

      <section className="status-grid" aria-label="Workflow gates and permissions">
        <div className="content-panel">
          <div className="section-heading">
            <div>
              <p className="section-kicker">Approval gates</p>
              <h2>Gate status</h2>
            </div>
          </div>
          <div className="stack-list">
            {approvalGates.map((gate) => (
              <div className="signal-row" key={gate.label}>
                <span>{gate.label}</span>
                <Badge tone={gate.tone}>{gate.status}</Badge>
              </div>
            ))}
          </div>
        </div>

        <div className="content-panel">
          <div className="section-heading">
            <div>
              <p className="section-kicker">Roles</p>
              <h2>Permission indicators</h2>
            </div>
          </div>
          <div className="stack-list">
            {rolePermissions.map((role) => (
              <div className="signal-row" key={role.label}>
                <span>{role.label}</span>
                <Badge tone={role.tone}>{role.permission}</Badge>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="content-panel">
        <div className="section-heading">
          <div>
            <p className="section-kicker">Transition history</p>
            <h2>Workflow timeline</h2>
          </div>
        </div>
        <div className="timeline-list">
          {workflowTimeline.map((item) => (
            <article className="timeline-item" key={item.id}>
              <Badge tone={getWorkflowTone(item.status)}>{item.status}</Badge>
              <div>
                <strong>{item.event}</strong>
                <p>
                  {item.actor} - {item.timestamp}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="content-panel">
        <div className="section-heading">
          <div>
            <p className="section-kicker">Lifecycle</p>
            <h2>Workflow statuses</h2>
          </div>
        </div>
        <div className="workflow-status-list">
          {workflowStatuses.map((status) => (
            <Badge key={status} tone={getWorkflowTone(status)}>
              {status}
            </Badge>
          ))}
        </div>
      </section>

      <section className="status-grid" aria-label="Blocked documents">
        {blockedDocuments.map((document) => (
          <article className="detail-panel" key={document.id}>
            <div>
              <p className="section-kicker">Blocked reason</p>
              <h2>{document.document}</h2>
              <p>{document.blockedReason}</p>
            </div>
            <Badge tone="danger">BLOCKED</Badge>
          </article>
        ))}
      </section>
    </div>
  );
}
