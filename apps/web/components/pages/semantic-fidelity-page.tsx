import {
  Badge,
  Card,
  EmptyState,
  ErrorState,
  Input,
  LoadingState,
  Table
} from "../ui";

type SemanticRisk = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
type SemanticIssueType =
  | "meaning drift"
  | "unjustified reinterpretation"
  | "omitted meaning"
  | "added meaning"
  | "terminology conflict"
  | "context mismatch";
type SemanticViewState = "ready" | "empty" | "loading" | "error";

interface SemanticIssue {
  alternative: string;
  document: string;
  explanation: string;
  id: string;
  issueType: SemanticIssueType;
  location: string;
  risk: SemanticRisk;
  segment: string;
}

const semanticScoreCards = [
  { label: "Semantic score", value: "92%", tone: "success" as const },
  { label: "Terminology conflicts", value: "1", tone: "warning" as const },
  { label: "High risk", value: "2", tone: "danger" as const },
  { label: "Reviewed segments", value: "68", tone: "info" as const }
];

const semanticIssues: SemanticIssue[] = [
  {
    alternative: "Use the validated term 'spirit' and preserve the source claim.",
    document: "Sample Document",
    explanation: "The target introduces an interpretive term not present in source.",
    id: "semantic-001",
    issueType: "unjustified reinterpretation",
    location: "Segment 1",
    risk: "HIGH",
    segment: "El espíritu sobrevive a la muerte del cuerpo."
  },
  {
    alternative: "Add the omitted reference to moral context.",
    document: "Sample Document",
    explanation: "The target omits contextual scope from the source segment.",
    id: "semantic-002",
    issueType: "omitted meaning",
    location: "Segment 3",
    risk: "MEDIUM",
    segment: "Cada prueba moral debe analizarse dentro de su contexto espiritual."
  },
  {
    alternative: "Align the term with the validated glossary entry.",
    document: "Terminology Appendix",
    explanation: "The target conflicts with a validated terminology decision.",
    id: "semantic-003",
    issueType: "terminology conflict",
    location: "Segment 8",
    risk: "CRITICAL",
    segment: "La conciencia conserva su individualidad."
  },
  {
    alternative: "Keep the same causal relation as the source sentence.",
    document: "Sample Document",
    explanation: "The target shifts the logical relation between clauses.",
    id: "semantic-004",
    issueType: "meaning drift",
    location: "Segment 12",
    risk: "LOW",
    segment: "La caridad no sustituye la responsabilidad."
  },
  {
    alternative: "Avoid adding doctrinal consequences not present in source.",
    document: "Sample Document",
    explanation: "The target adds meaning beyond the source segment.",
    id: "semantic-005",
    issueType: "added meaning",
    location: "Segment 14",
    risk: "HIGH",
    segment: "La transición no destruye la identidad."
  },
  {
    alternative: "Use the surrounding paragraph to preserve contextual reference.",
    document: "Terminology Appendix",
    explanation: "The target is correct in isolation but mismatches document context.",
    id: "semantic-006",
    issueType: "context mismatch",
    location: "Segment 21",
    risk: "MEDIUM",
    segment: "Este principio se entiende dentro del conjunto de la obra."
  }
];

function getSemanticViewState(): SemanticViewState {
  return "ready";
}

function getRiskTone(risk: SemanticRisk) {
  if (risk === "LOW") {
    return "success";
  }

  if (risk === "MEDIUM") {
    return "warning";
  }

  return "danger";
}

export function SemanticFidelityPage() {
  const currentViewState = getSemanticViewState();
  const activeIssue = semanticIssues[0];

  return (
    <div className="page-stack">
      <section className="metric-grid" aria-label="Semantic score summary">
        {semanticScoreCards.map((card) => (
          <Card key={card.label}>
            <div className="metric-card">
              <span>{card.label}</span>
              <strong>{card.value}</strong>
              <Badge tone={card.tone}>Semantic</Badge>
            </div>
          </Card>
        ))}
      </section>

      <section className="toolbar filter-toolbar">
        <Input
          aria-label="Filter semantic issues by risk"
          name="semantic-risk"
          placeholder="Risk"
        />
        <Input
          aria-label="Filter semantic issues by type"
          name="semantic-type"
          placeholder="Issue type"
        />
        <Input
          aria-label="Filter semantic issues by document"
          name="semantic-document"
          placeholder="Document"
        />
      </section>

      <section className="content-panel">
        <div className="section-heading">
          <div>
            <p className="section-kicker">Semantic Fidelity</p>
            <h2>Document and segment issues</h2>
          </div>
          <Badge tone="warning">{semanticIssues.length} issues</Badge>
        </div>

        {currentViewState === "loading" ? (
          <LoadingState label="Loading semantic review" />
        ) : null}
        {currentViewState === "error" ? (
          <ErrorState message="Semantic fidelity results could not be loaded." />
        ) : null}
        {currentViewState === "empty" ? (
          <EmptyState title="No semantic issues" />
        ) : null}
        {currentViewState === "ready" ? (
          <Table ariaLabel="Semantic fidelity issues">
            <thead>
              <tr>
                <th>Risk</th>
                <th>Issue type</th>
                <th>Document</th>
                <th>Location</th>
                <th>Source segment</th>
              </tr>
            </thead>
            <tbody>
              {semanticIssues.map((issue) => (
                <tr key={issue.id}>
                  <td>
                    <Badge tone={getRiskTone(issue.risk)}>{issue.risk}</Badge>
                  </td>
                  <td>{issue.issueType}</td>
                  <td>{issue.document}</td>
                  <td>{issue.location}</td>
                  <td>{issue.segment}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : null}
      </section>

      {activeIssue ? (
        <section className="detail-panel" aria-label="Semantic issue detail">
          <div>
            <p className="section-kicker">Explanation</p>
            <h2>{activeIssue.issueType}</h2>
            <p>{activeIssue.explanation}</p>
          </div>
          <div>
            <p className="section-kicker">Alternative</p>
            <p>{activeIssue.alternative}</p>
          </div>
        </section>
      ) : null}
    </div>
  );
}
