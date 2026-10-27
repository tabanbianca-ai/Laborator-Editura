import {
  type AiAgentIdentityResolution,
  type AiAgentType,
  type CanonicalAiAgentIdentity
} from "@laborator/shared";
import { AI_AGENT_GOVERNANCE_PROFILES } from "./ai-governance.types";

// Compatibility classifications do not define new agents or runtime bindings.
const LEGACY_TYPES: Partial<Record<string, AiAgentType[]>> = {
  "translation-agent": ["TRANSLATION_AGENT"],
  "documentation-agent": ["DOCUMENTATION_AGENT"],
  "review-agent": ["CORRECTION_AGENT", "EDITORIAL_REVIEW_AGENT"],
  "projects-agent": ["METADATA_AGENT"],
  "quality-agent": ["MONITORING_AGENT"],
  "publishing-agent": ["PUBLICATION_AGENT"],
  "illustration-agent": ["ILLUSTRATION_AGENT"],
  "audio-agent": ["AUDIO_AGENT"],
  "video-agent": ["VIDEO_AGENT"],
  "planning-coordination-subagent": ["SCHEDULING_AGENT"],
  "terminology-lexicography-subagent": ["TERMINOLOGY_AGENT"]
};

const LEGACY_ALIASES: Record<string, readonly string[]> = {
  "Translation AI": ["translation-agent"],
  "Lexicographic AI": ["terminology-lexicography-subagent"],
  "Semantic Fidelity": ["semantic-fidelity-subagent"],
  "Editorial Decision Agent": ["editorial-decision-subagent"],
  "Layout Publishing Agent": ["layout-agent", "publishing-agent"],
  "Multimedia Creation Agent": ["illustration-agent", "audio-agent", "video-agent"],
  "Media Localization Agent": ["media-localization-subagent"],
  "Platform Engineering Agent": ["platform-engineering-subagent"],
  "Scheduling Agent": ["planning-coordination-subagent"],
  "Author Studio AI": ["manuscripts-agent"],
  "Research AI": ["documentation-agent"]
};

export function listCanonicalAiAgentIdentities(): CanonicalAiAgentIdentity[] {
  return AI_AGENT_GOVERNANCE_PROFILES.map((profile) => ({
    agentId: profile.id,
    canonicalName: profile.agentName,
    kind: profile.agentKind,
    parentAgentIds: [...(profile.parentAgentIds ?? (profile.parentAgentId ? [profile.parentAgentId] : []))],
    governanceVersion: profile.version,
    legacyTypes: [...(LEGACY_TYPES[profile.id] ?? [])]
  }));
}

export function resolveAiAgentIdentity(value: string): AiAgentIdentityResolution {
  const identities = listCanonicalAiAgentIdentities();
  const canonical = identities.find((identity) =>
    identity.agentId === value || identity.canonicalName === value
  );
  if (canonical) {
    return { status: "RESOLVED", identity: canonical };
  }
  const candidateIds = LEGACY_ALIASES[value] ?? identities
    .filter((identity) => identity.legacyTypes.some((type) => type === value))
    .map((identity) => identity.agentId);
  if (candidateIds.length === 1) {
    const identity = identities.find((candidate) => candidate.agentId === candidateIds[0]);
    return identity ? { status: "RESOLVED", identity } : { status: "UNKNOWN" };
  }
  return candidateIds.length > 1
    ? { status: "AMBIGUOUS", candidateAgentIds: [...candidateIds] }
    : { status: "UNKNOWN" };
}
