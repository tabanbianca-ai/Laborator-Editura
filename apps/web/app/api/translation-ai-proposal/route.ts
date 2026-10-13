import { NextResponse } from "next/server";
import { generateAiTranslationProposal } from "../../../lib/translation-workspace-client";

interface ProposalRequest {
  domain?: string;
  explicitExternalProcessingAuthorization?: boolean;
  segmentId?: string;
}

export async function POST(request: Request) {
  let input: ProposalRequest;
  try {
    input = await request.json() as ProposalRequest;
  } catch {
    return NextResponse.json({ error: "INVALID_REQUEST" }, { status: 400 });
  }

  if (!input.segmentId || input.explicitExternalProcessingAuthorization !== true) {
    return NextResponse.json({ error: "EXPLICIT_AUTHORIZATION_REQUIRED" }, { status: 400 });
  }

  const result = await generateAiTranslationProposal({
    domain: input.domain,
    explicitExternalProcessingAuthorization: true,
    segmentId: input.segmentId
  });

  if (!result.data) {
    return NextResponse.json({ error: result.error ?? "AI_PROPOSAL_UNAVAILABLE" }, { status: 502 });
  }

  return NextResponse.json(result.data);
}
