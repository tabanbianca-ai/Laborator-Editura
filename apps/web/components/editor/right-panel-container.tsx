"use client";

import { useState } from "react";

import { Badge } from "../ui";

interface TmSuggestion {
  confidence: number;
  source: string;
  status: string;
  target: string;
}

interface TerminologyMatch {
  forbidden: string[];
  source: string;
  status: string;
  target: string;
}

interface QaIssue {
  check: string;
  message: string;
  severity: string;
  status: string;
}

interface SemanticIssue {
  alternative: string;
  explanation: string;
  issueType: string;
  risk: string;
}

interface StatusSignal {
  label: string;
  status: string;
  tone: "danger" | "info" | "neutral" | "success" | "warning";
}

interface RightPanelContainerProps {
  exportReadiness: StatusSignal[];
  qaIssues: QaIssue[];
  semanticIssues: SemanticIssue[];
  suggestions: string[];
  terminologyMatches: TerminologyMatch[];
  tmSuggestions: TmSuggestion[];
  workflowSignals: StatusSignal[];
}

type RightPanelTab =
  | "tm"
  | "terminology"
  | "qa"
  | "semantic"
  | "workflow"
  | "export";

const tabs: Array<{ id: RightPanelTab; label: string }> = [
  { id: "tm", label: "TM Suggestions" },
  { id: "terminology", label: "Terminology" },
  { id: "qa", label: "QA" },
  { id: "semantic", label: "Semantic Fidelity" },
  { id: "workflow", label: "Workflow" },
  { id: "export", label: "Export readiness" }
];

export function RightPanelContainer({
  exportReadiness,
  qaIssues,
  semanticIssues,
  suggestions,
  terminologyMatches,
  tmSuggestions,
  workflowSignals
}: RightPanelContainerProps) {
  const [activeTab, setActiveTab] = useState<RightPanelTab>("tm");
  const hasBlockingIssues =
    qaIssues.some(
      (issue) => issue.severity === "HIGH" || issue.severity === "CRITICAL"
    ) ||
    semanticIssues.some(
      (issue) => issue.risk === "HIGH" || issue.risk === "CRITICAL"
    );

  return (
    <aside className="editor-panel right-panel" aria-label="Editor context">
      <div className="editor-panel-header">
        <p className="section-kicker">Context</p>
        <h2>Validation signals</h2>
      </div>

      <div className="signal-stack">
        <div className="signal-row">
          <span>Semantic fidelity</span>
          <Badge tone="success">96%</Badge>
        </div>
        <div className="signal-row">
          <span>Terminology</span>
          <Badge tone="success">98%</Badge>
        </div>
        <div className="signal-row">
          <span>QA risk</span>
          <Badge tone="success">Low</Badge>
        </div>
        {hasBlockingIssues ? (
          <div className="blocking-warning" role="status">
            Unresolved HIGH/CRITICAL findings require review before approval.
          </div>
        ) : null}
      </div>

      <div className="right-panel-tabs" aria-label="Editor right panel tabs">
        {tabs.map((tab) => (
          <button
            aria-pressed={activeTab === tab.id}
            className={
              activeTab === tab.id
                ? "right-panel-tab right-panel-tab-active"
                : "right-panel-tab"
            }
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            type="button"
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "tm" ? (
        <div className="suggestion-list" aria-label="TM suggestions">
          {tmSuggestions.map((suggestion) => (
            <article className="tm-suggestion-card" key={suggestion.source}>
              <div className="signal-row">
                <span>{suggestion.confidence}% confidence</span>
                <Badge tone={suggestion.status === "APPROVED" ? "success" : "info"}>
                  {suggestion.status}
                </Badge>
              </div>
              <p>{suggestion.source}</p>
              <p>{suggestion.target}</p>
            </article>
          ))}
          {suggestions.map((suggestion) => (
            <p key={suggestion}>{suggestion}</p>
          ))}
        </div>
      ) : null}

      {activeTab === "terminology" ? (
        <div className="terminology-tab-panel" aria-label="Terminology matches">
          <div className="priority-indicator">
            <Badge tone="success">VALIDATED priority</Badge>
            <span>Validated terminology overrides TM and AI suggestions.</span>
          </div>
          <div className="terminology-warning" role="status">
            Forbidden variant warning: avoid interpretive variants when a validated
            term exists.
          </div>
          <div className="terminology-match-list">
            {terminologyMatches.map((match) => (
              <article className="terminology-match-card" key={match.source}>
                <div className="signal-row">
                  <span>
                    {match.source} -&gt; {match.target}
                  </span>
                  <Badge tone={match.status === "VALIDATED" ? "success" : "warning"}>
                    {match.status}
                  </Badge>
                </div>
                <p>Forbidden: {match.forbidden.join(", ")}</p>
              </article>
            ))}
          </div>
        </div>
      ) : null}

      {activeTab === "qa" ? (
        <div className="qa-tab-panel" aria-label="QA findings">
          <div className="blocking-warning" role="status">
            Unresolved HIGH/CRITICAL QA issues are blocking review.
          </div>
          <div className="terminology-match-list">
            {qaIssues.map((issue) => (
              <article className="terminology-match-card" key={issue.check}>
                <div className="signal-row">
                  <span>{issue.check}</span>
                  <Badge
                    tone={
                      issue.severity === "LOW"
                        ? "info"
                        : issue.severity === "MEDIUM"
                          ? "warning"
                          : "danger"
                    }
                  >
                    {issue.severity}
                  </Badge>
                </div>
                <p>{issue.message}</p>
                <p>Status: {issue.status}</p>
              </article>
            ))}
          </div>
        </div>
      ) : null}

      {activeTab === "semantic" ? (
        <div className="qa-tab-panel" aria-label="Semantic fidelity findings">
          <div className="blocking-warning" role="status">
            Unresolved semantic risk requires authorized human review.
          </div>
          <div className="terminology-match-list">
            {semanticIssues.map((issue) => (
              <article className="terminology-match-card" key={issue.issueType}>
                <div className="signal-row">
                  <span>{issue.issueType}</span>
                  <Badge
                    tone={
                      issue.risk === "LOW"
                        ? "success"
                        : issue.risk === "MEDIUM"
                          ? "warning"
                          : "danger"
                    }
                  >
                    {issue.risk}
                  </Badge>
                </div>
                <p>{issue.explanation}</p>
                <p>Alternative: {issue.alternative}</p>
              </article>
            ))}
          </div>
        </div>
      ) : null}

      {activeTab === "workflow" ? (
        <div className="qa-tab-panel" aria-label="Workflow signals">
          <div className="blocking-warning" role="status">
            Workflow cannot advance while HIGH/CRITICAL findings remain open.
          </div>
          <div className="terminology-match-list">
            {workflowSignals.map((signal) => (
              <article className="terminology-match-card" key={signal.label}>
                <div className="signal-row">
                  <span>{signal.label}</span>
                  <Badge tone={signal.tone}>{signal.status}</Badge>
                </div>
              </article>
            ))}
          </div>
        </div>
      ) : null}

      {activeTab === "export" ? (
        <div className="qa-tab-panel" aria-label="Export readiness signals">
          <div className="blocking-warning" role="status">
            Export remains disabled until workflow gates are cleared.
          </div>
          <div className="terminology-match-list">
            {exportReadiness.map((signal) => (
              <article className="terminology-match-card" key={signal.label}>
                <div className="signal-row">
                  <span>{signal.label}</span>
                  <Badge tone={signal.tone}>{signal.status}</Badge>
                </div>
              </article>
            ))}
          </div>
        </div>
      ) : null}
    </aside>
  );
}
