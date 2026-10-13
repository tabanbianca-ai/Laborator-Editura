"use client";

import { useState } from "react";
import type { AiTranslationProposal } from "../../lib/translation-workspace-client";
import { Badge, Button, ErrorState } from "../ui";

interface TranslationTargetEditorProps {
  aiLabels: {
    authorization: string;
    confidence: string;
    explanation: string;
    generate: string;
    proposal: string;
    proposalOnly: string;
    unavailable: string;
    useProposal: string;
  };
  domain?: string;
  initialTargetText: string;
  segmentId: string;
  targetTextLabel: string;
}

export function TranslationTargetEditor({
  aiLabels,
  domain,
  initialTargetText,
  segmentId,
  targetTextLabel
}: TranslationTargetEditorProps) {
  const [authorized, setAuthorized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [proposal, setProposal] = useState<AiTranslationProposal | null>(null);
  const [targetText, setTargetText] = useState(initialTargetText);

  async function generateProposal() {
    setError(null);
    setLoading(true);
    try {
      const response = await fetch("/api/translation-ai-proposal", {
        body: JSON.stringify({
          domain,
          explicitExternalProcessingAuthorization: authorized,
          segmentId
        }),
        headers: { "Content-Type": "application/json" },
        method: "POST"
      });
      if (!response.ok) {
        throw new Error(aiLabels.unavailable);
      }
      setProposal(await response.json() as AiTranslationProposal);
    } catch {
      setError(aiLabels.unavailable);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <label className="ui-input-field">
        <span>{targetTextLabel}</span>
        <textarea
          className="ui-input translation-target-textarea"
          name="targetText"
          onChange={(event) => setTargetText(event.target.value)}
          rows={14}
          value={targetText}
        />
      </label>
      <section className="ai-translation-proposal" aria-label={aiLabels.proposal}>
        <label className="rights-checkbox">
          <input
            checked={authorized}
            onChange={(event) => setAuthorized(event.target.checked)}
            type="checkbox"
          />
          <span>{aiLabels.authorization}</span>
        </label>
        <Button disabled={!authorized || loading} onClick={generateProposal} type="button" variant="secondary">
          {aiLabels.generate}
        </Button>
        {error ? <ErrorState message={error} /> : null}
        {proposal ? (
          <article className="reference-item">
            <div className="review-status-row">
              <strong>{aiLabels.proposal}</strong>
              <Badge tone="warning">{aiLabels.proposalOnly}</Badge>
              <Badge tone="info">{proposal.provider} / {proposal.model}</Badge>
              <Badge tone="neutral">{aiLabels.confidence} {Math.round(proposal.confidence * 100)}%</Badge>
            </div>
            <p>{proposal.proposedText}</p>
            <small>{aiLabels.explanation}: {proposal.explanation}</small>
            <Button onClick={() => setTargetText(proposal.proposedText)} type="button" variant="secondary">
              {aiLabels.useProposal}
            </Button>
          </article>
        ) : null}
      </section>
    </>
  );
}
