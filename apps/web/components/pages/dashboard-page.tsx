import { Badge, Card, Table } from "../ui";

const metrics = [
  { label: "Active projects", value: "4", tone: "info" as const },
  { label: "Documents in QA", value: "7", tone: "warning" as const },
  { label: "QA average", value: "94%", tone: "success" as const },
  { label: "Semantic risk", value: "Low", tone: "success" as const }
];

const workflowRows = [
  {
    document: "Sample Document",
    project: "Spiritism Translation MVP",
    qa: "94%",
    status: "IN_REVIEW"
  },
  {
    document: "Terminology Appendix",
    project: "Philosophy Corpus",
    qa: "91%",
    status: "IN_QA"
  },
  {
    document: "Export Validation",
    project: "Closed Beta",
    qa: "Ready",
    status: "READY_FOR_EXPORT"
  }
];

export function DashboardPage() {
  return (
    <div className="page-stack">
      <section className="metric-grid" aria-label="MVP status">
        {metrics.map((metric) => (
          <Card key={metric.label}>
            <div className="metric-card">
              <span>{metric.label}</span>
              <strong>{metric.value}</strong>
              <Badge tone={metric.tone}>MVP</Badge>
            </div>
          </Card>
        ))}
      </section>

      <section className="content-panel">
        <div className="section-heading">
          <div>
            <p className="section-kicker">Workflow</p>
            <h2>Review queue</h2>
          </div>
          <Badge tone="neutral">Phase 1</Badge>
        </div>

        <Table ariaLabel="Review queue">
          <thead>
            <tr>
              <th>Document</th>
              <th>Project</th>
              <th>QA</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {workflowRows.map((row) => (
              <tr key={`${row.project}-${row.document}`}>
                <td>{row.document}</td>
                <td>{row.project}</td>
                <td>{row.qa}</td>
                <td>
                  <Badge tone={row.status === "IN_QA" ? "warning" : "success"}>
                    {row.status}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </section>
    </div>
  );
}
