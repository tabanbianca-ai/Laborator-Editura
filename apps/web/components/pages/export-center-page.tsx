import {
  Badge,
  Button,
  Card,
  EmptyState,
  ErrorState,
  LoadingState,
  Table
} from "../ui";

type ExportFormat = "JSON Master" | "PDF" | "DOCX" | "TXT";
type ExportViewState = "ready" | "empty" | "loading" | "error";

interface ExportArtifact {
  format: ExportFormat;
  id: string;
  name: string;
  status: string;
  timestamp: string;
}

const availableFormats: ExportFormat[] = ["JSON Master", "PDF", "DOCX", "TXT"];

const artifacts: ExportArtifact[] = [
  {
    format: "JSON Master",
    id: "artifact-001",
    name: "sample-document-master.json",
    status: "Generated",
    timestamp: "2026-06-13 11:30"
  },
  {
    format: "DOCX",
    id: "artifact-002",
    name: "sample-document-review.docx",
    status: "Draft",
    timestamp: "2026-06-13 11:34"
  }
];

const exportHistory = [
  {
    actor: "Admin",
    event: "Marked ready for export",
    id: "export-history-001",
    timestamp: "2026-06-13 11:10"
  },
  {
    actor: "System",
    event: "Generated JSON Master artifact",
    id: "export-history-002",
    timestamp: "2026-06-13 11:30"
  }
];

const auditPreview = [
  "Workflow status verified as READY_FOR_EXPORT.",
  "QA blocking issues checked before export.",
  "Human approval recorded before artifact generation."
];

const blockedReasons = [
  "PDF export waits for publishing profile selection.",
  "DOCX export requires final reviewer acknowledgement.",
  "TXT export is disabled until document status is READY_FOR_EXPORT."
];

function getExportViewState(): ExportViewState {
  return "ready";
}

export function ExportCenterPage() {
  const currentViewState = getExportViewState();

  return (
    <div className="page-stack">
      <section className="metric-grid" aria-label="Export readiness overview">
        <Card>
          <div className="metric-card">
            <span>Workflow gate</span>
            <strong>Ready</strong>
            <Badge tone="success">READY_FOR_EXPORT</Badge>
          </div>
        </Card>
        <Card>
          <div className="metric-card">
            <span>Formats</span>
            <strong>{availableFormats.length}</strong>
            <Badge tone="info">Available</Badge>
          </div>
        </Card>
        <Card>
          <div className="metric-card">
            <span>Artifacts</span>
            <strong>{artifacts.length}</strong>
            <Badge tone="success">Generated</Badge>
          </div>
        </Card>
        <Card>
          <div className="metric-card">
            <span>Blocked exports</span>
            <strong>{blockedReasons.length}</strong>
            <Badge tone="warning">Pending</Badge>
          </div>
        </Card>
      </section>

      <section className="content-panel">
        <div className="section-heading">
          <div>
            <p className="section-kicker">Export Center</p>
            <h2>Available formats</h2>
          </div>
          <Button disabled variant="secondary">
            Export
          </Button>
        </div>

        {currentViewState === "loading" ? (
          <LoadingState label="Loading export readiness" />
        ) : null}
        {currentViewState === "error" ? (
          <ErrorState message="Export readiness could not be loaded." />
        ) : null}
        {currentViewState === "empty" ? <EmptyState title="No export formats" /> : null}
        {currentViewState === "ready" ? (
          <div className="format-grid">
            {availableFormats.map((format) => (
              <article className="format-card" key={format}>
                <strong>{format}</strong>
                <Badge tone={format === "JSON Master" ? "success" : "neutral"}>
                  {format === "JSON Master" ? "Canonical" : "Planned"}
                </Badge>
              </article>
            ))}
          </div>
        ) : null}
      </section>

      <section className="status-grid" aria-label="Export gates and blocks">
        <div className="content-panel">
          <div className="section-heading">
            <div>
              <p className="section-kicker">Workflow gate</p>
              <h2>Gate status</h2>
            </div>
            <Badge tone="success">READY</Badge>
          </div>
          <div className="stack-list">
            <div className="signal-row">
              <span>Document approved</span>
              <Badge tone="success">Yes</Badge>
            </div>
            <div className="signal-row">
              <span>QA blockers</span>
              <Badge tone="warning">Review</Badge>
            </div>
            <div className="signal-row">
              <span>Semantic blockers</span>
              <Badge tone="warning">Review</Badge>
            </div>
          </div>
        </div>

        <div className="content-panel">
          <div className="section-heading">
            <div>
              <p className="section-kicker">Blocked exports</p>
              <h2>Reasons</h2>
            </div>
          </div>
          <div className="stack-list">
            {blockedReasons.map((reason) => (
              <div className="blocking-warning" key={reason} role="status">
                {reason}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="content-panel">
        <div className="section-heading">
          <div>
            <p className="section-kicker">Artifacts</p>
            <h2>Generated artifact list</h2>
          </div>
          <Badge tone="info">{artifacts.length} artifacts</Badge>
        </div>
        <Table ariaLabel="Export artifacts">
          <thead>
            <tr>
              <th>Name</th>
              <th>Format</th>
              <th>Status</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {artifacts.map((artifact) => (
              <tr key={artifact.id}>
                <td>{artifact.name}</td>
                <td>{artifact.format}</td>
                <td>
                  <Badge tone={artifact.status === "Generated" ? "success" : "warning"}>
                    {artifact.status}
                  </Badge>
                </td>
                <td>{artifact.timestamp}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </section>

      <section className="status-grid" aria-label="Export history and audit">
        <div className="content-panel">
          <div className="section-heading">
            <div>
              <p className="section-kicker">Export history</p>
              <h2>Recent events</h2>
            </div>
          </div>
          <div className="timeline-list">
            {exportHistory.map((event) => (
              <article className="timeline-item" key={event.id}>
                <Badge tone="info">{event.actor}</Badge>
                <div>
                  <strong>{event.event}</strong>
                  <p>{event.timestamp}</p>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="content-panel">
          <div className="section-heading">
            <div>
              <p className="section-kicker">Audit trail</p>
              <h2>Preview</h2>
            </div>
          </div>
          <div className="stack-list">
            {auditPreview.map((item) => (
              <div className="signal-row" key={item}>
                <span>{item}</span>
                <Badge tone="success">Audit</Badge>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
