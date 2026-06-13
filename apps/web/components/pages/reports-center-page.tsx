import {
  Badge,
  Card,
  EmptyState,
  ErrorState,
  LoadingState,
  Table
} from "../ui";

type ReportsViewState = "ready" | "empty" | "loading" | "error";

const qualityMetrics = [
  { label: "Project quality", value: "93%", tone: "success" as const },
  { label: "QA score", value: "94%", tone: "success" as const },
  { label: "Semantic fidelity", value: "92%", tone: "success" as const },
  { label: "Terminology compliance", value: "97%", tone: "success" as const }
];

const reportRows = [
  {
    exportReadiness: "READY",
    project: "Spiritism Translation MVP",
    qaScore: "94%",
    semanticScore: "92%",
    terminology: "97%",
    workflow: "IN_REVIEW"
  },
  {
    exportReadiness: "BLOCKED",
    project: "Philosophy Corpus",
    qaScore: "88%",
    semanticScore: "89%",
    terminology: "91%",
    workflow: "BLOCKED"
  },
  {
    exportReadiness: "READY",
    project: "Closed Beta",
    qaScore: "96%",
    semanticScore: "95%",
    terminology: "98%",
    workflow: "READY_FOR_EXPORT"
  }
];

const bottlenecks = [
  { label: "QA review queue", value: "4 documents", tone: "warning" as const },
  { label: "Semantic review queue", value: "2 documents", tone: "warning" as const },
  { label: "Export gate waiting", value: "1 document", tone: "info" as const }
];

const auditSummary = [
  { label: "Audit events today", value: "128", tone: "info" as const },
  { label: "Human approvals", value: "9", tone: "success" as const },
  { label: "Blocked actions", value: "3", tone: "warning" as const }
];

const healthIndicators = [
  { label: "CI status", status: "Green", tone: "success" as const },
  { label: "Backup dry-run", status: "Ready", tone: "success" as const },
  { label: "Staging config", status: "Prepared", tone: "info" as const },
  { label: "Release state", status: "Closed beta", tone: "info" as const }
];

function getReportsViewState(): ReportsViewState {
  return "ready";
}

export function ReportsCenterPage() {
  const currentViewState = getReportsViewState();

  return (
    <div className="page-stack">
      <section className="metric-grid" aria-label="Project quality overview">
        {qualityMetrics.map((metric) => (
          <Card key={metric.label}>
            <div className="metric-card">
              <span>{metric.label}</span>
              <strong>{metric.value}</strong>
              <Badge tone={metric.tone}>Report</Badge>
            </div>
          </Card>
        ))}
      </section>

      <section className="content-panel">
        <div className="section-heading">
          <div>
            <p className="section-kicker">Reports Center</p>
            <h2>Project quality overview</h2>
          </div>
          <Badge tone="info">{reportRows.length} projects</Badge>
        </div>

        {currentViewState === "loading" ? (
          <LoadingState label="Loading reports" />
        ) : null}
        {currentViewState === "error" ? (
          <ErrorState message="Reports could not be loaded." />
        ) : null}
        {currentViewState === "empty" ? <EmptyState title="No reports" /> : null}
        {currentViewState === "ready" ? (
          <Table ariaLabel="Project quality report">
            <thead>
              <tr>
                <th>Project</th>
                <th>QA score</th>
                <th>Semantic score</th>
                <th>Terminology</th>
                <th>Workflow</th>
                <th>Export</th>
              </tr>
            </thead>
            <tbody>
              {reportRows.map((row) => (
                <tr key={row.project}>
                  <td>{row.project}</td>
                  <td>{row.qaScore}</td>
                  <td>{row.semanticScore}</td>
                  <td>{row.terminology}</td>
                  <td>
                    <Badge tone={row.workflow === "BLOCKED" ? "danger" : "info"}>
                      {row.workflow}
                    </Badge>
                  </td>
                  <td>
                    <Badge
                      tone={row.exportReadiness === "READY" ? "success" : "warning"}
                    >
                      {row.exportReadiness}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : null}
      </section>

      <section className="status-grid" aria-label="Report summaries">
        <div className="content-panel">
          <div className="section-heading">
            <div>
              <p className="section-kicker">Charts</p>
              <h2>Quality trend</h2>
            </div>
          </div>
          <div className="chart-placeholder" aria-label="Quality trend chart">
            <span style={{ height: "62%" }} />
            <span style={{ height: "74%" }} />
            <span style={{ height: "69%" }} />
            <span style={{ height: "88%" }} />
            <span style={{ height: "93%" }} />
          </div>
        </div>

        <div className="content-panel">
          <div className="section-heading">
            <div>
              <p className="section-kicker">Workflow bottlenecks</p>
              <h2>Operational summary</h2>
            </div>
          </div>
          <div className="stack-list">
            {bottlenecks.map((item) => (
              <div className="signal-row" key={item.label}>
                <span>{item.label}</span>
                <Badge tone={item.tone}>{item.value}</Badge>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="status-grid" aria-label="Audit and beta health">
        <div className="content-panel">
          <div className="section-heading">
            <div>
              <p className="section-kicker">Audit summary</p>
              <h2>Traceability preview</h2>
            </div>
          </div>
          <div className="stack-list">
            {auditSummary.map((item) => (
              <div className="signal-row" key={item.label}>
                <span>{item.label}</span>
                <Badge tone={item.tone}>{item.value}</Badge>
              </div>
            ))}
          </div>
        </div>

        <div className="content-panel">
          <div className="section-heading">
            <div>
              <p className="section-kicker">Closed beta</p>
              <h2>Health indicators</h2>
            </div>
          </div>
          <div className="stack-list">
            {healthIndicators.map((item) => (
              <div className="signal-row" key={item.label}>
                <span>{item.label}</span>
                <Badge tone={item.tone}>{item.status}</Badge>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
