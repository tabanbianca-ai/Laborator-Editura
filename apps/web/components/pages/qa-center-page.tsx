import {
  Badge,
  Button,
  Card,
  EmptyState,
  ErrorState,
  Input,
  LoadingState,
  Table
} from "../ui";

type QaSeverity = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
type QaIssueStatus = "OPEN" | "RESOLVED" | "ACCEPTED_RISK";
type QaViewState = "ready" | "empty" | "loading" | "error";

interface QaReport {
  document: string;
  id: string;
  openIssues: number;
  project: string;
  score: number;
  status: string;
}

interface QaIssue {
  check: string;
  document: string;
  id: string;
  location: string;
  message: string;
  severity: QaSeverity;
  status: QaIssueStatus;
}

const qaReports: QaReport[] = [
  {
    document: "Sample Document",
    id: "qa-report-001",
    openIssues: 2,
    project: "Spiritism Translation MVP",
    score: 94,
    status: "IN_QA"
  },
  {
    document: "Terminology Appendix",
    id: "qa-report-002",
    openIssues: 4,
    project: "Philosophy Corpus",
    score: 88,
    status: "IN_REVIEW"
  }
];

const qaIssues: QaIssue[] = [
  {
    check: "Terminology violation",
    document: "Sample Document",
    id: "qa-issue-001",
    location: "Segment 2",
    message: "Forbidden terminology variant detected in target text.",
    severity: "HIGH",
    status: "OPEN"
  },
  {
    check: "Number mismatch",
    document: "Sample Document",
    id: "qa-issue-002",
    location: "Segment 8",
    message: "Source and target numeric values do not match.",
    severity: "CRITICAL",
    status: "OPEN"
  },
  {
    check: "Punctuation mismatch",
    document: "Terminology Appendix",
    id: "qa-issue-003",
    location: "Segment 4",
    message: "Terminal punctuation differs from source punctuation.",
    severity: "MEDIUM",
    status: "RESOLVED"
  },
  {
    check: "Too-short translation",
    document: "Terminology Appendix",
    id: "qa-issue-004",
    location: "Segment 11",
    message: "Target translation is unusually short compared with source.",
    severity: "LOW",
    status: "OPEN"
  }
];

const scoreCards = [
  { label: "Document QA score", value: "94%", tone: "success" as const },
  { label: "Open issues", value: "7", tone: "warning" as const },
  { label: "High risk", value: "2", tone: "danger" as const },
  { label: "Resolved", value: "12", tone: "info" as const }
];

function getQaViewState(): QaViewState {
  return "ready";
}

function getSeverityTone(severity: QaSeverity) {
  if (severity === "LOW") {
    return "info";
  }

  if (severity === "MEDIUM") {
    return "warning";
  }

  return "danger";
}

function getStatusTone(status: QaIssueStatus) {
  if (status === "RESOLVED") {
    return "success";
  }

  if (status === "ACCEPTED_RISK") {
    return "warning";
  }

  return "neutral";
}

export function QaCenterPage() {
  const currentViewState = getQaViewState();
  const activeIssue = qaIssues[0];

  return (
    <div className="page-stack">
      <section className="metric-grid" aria-label="QA score summary">
        {scoreCards.map((card) => (
          <Card key={card.label}>
            <div className="metric-card">
              <span>{card.label}</span>
              <strong>{card.value}</strong>
              <Badge tone={card.tone}>QA</Badge>
            </div>
          </Card>
        ))}
      </section>

      <section className="toolbar filter-toolbar">
        <Input
          aria-label="Filter QA by severity"
          name="qa-severity"
          placeholder="Severity"
        />
        <Input aria-label="Filter QA by status" name="qa-status" placeholder="Status" />
        <Input
          aria-label="Filter QA by document"
          name="qa-document"
          placeholder="Document"
        />
      </section>

      <section className="content-panel">
        <div className="section-heading">
          <div>
            <p className="section-kicker">QA Center</p>
            <h2>QA reports</h2>
          </div>
          <Badge tone="info">{qaReports.length} reports</Badge>
        </div>

        {currentViewState === "loading" ? <LoadingState label="Loading QA" /> : null}
        {currentViewState === "error" ? (
          <ErrorState message="QA reports could not be loaded." />
        ) : null}
        {currentViewState === "empty" ? <EmptyState title="No QA reports" /> : null}
        {currentViewState === "ready" ? (
          <Table ariaLabel="QA reports">
            <thead>
              <tr>
                <th>Document</th>
                <th>Project</th>
                <th>Score</th>
                <th>Open issues</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {qaReports.map((report) => (
                <tr key={report.id}>
                  <td>{report.document}</td>
                  <td>{report.project}</td>
                  <td>{report.score}%</td>
                  <td>{report.openIssues}</td>
                  <td>
                    <Badge tone={report.status === "IN_QA" ? "warning" : "info"}>
                      {report.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : null}
      </section>

      <section className="content-panel">
        <div className="section-heading">
          <div>
            <p className="section-kicker">Issues</p>
            <h2>QA issues</h2>
          </div>
          <Badge tone="warning">{qaIssues.length} issues</Badge>
        </div>

        <Table ariaLabel="QA issues">
          <thead>
            <tr>
              <th>Severity</th>
              <th>Status</th>
              <th>Document</th>
              <th>Location</th>
              <th>Check</th>
              <th>Message</th>
            </tr>
          </thead>
          <tbody>
            {qaIssues.map((issue) => (
              <tr key={issue.id}>
                <td>
                  <Badge tone={getSeverityTone(issue.severity)}>{issue.severity}</Badge>
                </td>
                <td>
                  <Badge tone={getStatusTone(issue.status)}>{issue.status}</Badge>
                </td>
                <td>{issue.document}</td>
                <td>{issue.location}</td>
                <td>{issue.check}</td>
                <td>{issue.message}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </section>

      {activeIssue ? (
        <section className="detail-panel" aria-label="QA issue detail">
          <div>
            <p className="section-kicker">Issue detail</p>
            <h2>{activeIssue.check}</h2>
            <p>{activeIssue.message}</p>
          </div>
          <Button disabled variant="secondary">
            Mark resolved
          </Button>
        </section>
      ) : null}
    </div>
  );
}
