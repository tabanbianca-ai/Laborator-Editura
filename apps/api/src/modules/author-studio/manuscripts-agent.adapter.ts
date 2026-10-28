import { ForbiddenException, Injectable } from "@nestjs/common";
import { AuthorStudioService } from "./author-studio.service";
import { localDescriptor, type LocalHandlerAdapter, type LocalHandlerInput } from "../ai-governance/ai-handler.contract";
import { type AuthenticatedRequestContext } from "../auth/request-context.types";

@Injectable()
export class ManuscriptsAgentAdapter implements LocalHandlerAdapter {
  constructor(private readonly manuscripts: AuthorStudioService) {}
  descriptors() { return [localDescriptor("manuscripts-agent", "manuscripts.integrity.v1", "manuscripts.integrity", "MANUSCRIPT", ["document.read"], false, ["sectionCount"])]; }
  async authorize(actor: AuthenticatedRequestContext, input: LocalHandlerInput) {
    const manuscript = await this.manuscripts.getManuscript(actor, input.resource.id);
    if (manuscript.projectId !== input.projectId) throw new ForbiddenException();
  }
  async execute(_agentId: string, actor: AuthenticatedRequestContext, input: LocalHandlerInput, signal: AbortSignal) {
    const manuscript = await this.manuscripts.getManuscript(actor, input.resource.id);
    if (signal.aborted || manuscript.projectId !== input.projectId) throw new ForbiddenException();
    const sections = await this.manuscripts.listSections(actor, manuscript.id);
    if (sections.length > 200) throw new ForbiddenException("Manuscript exceeds bounded local analysis.");
    const issues: string[] = [];
    if (!sections.length) issues.push("NO_MANUSCRIPT_SECTIONS");
    if (new Set(sections.map((section) => section.orderIndex)).size !== sections.length) issues.push("DUPLICATE_SECTION_ORDER");
    const ids = new Set(sections.map((section) => section.id));
    const byId = new Map(sections.map((section) => [section.id, section]));
    const provenance = [{ resourceType: "MANUSCRIPT", resourceId: manuscript.id, version: manuscript.updatedAt }];
    for (const section of sections) {
      if (signal.aborted) throw new ForbiddenException();
      provenance.push({ resourceType: "SECTION", resourceId: section.id, version: section.updatedAt });
      if (section.parentSectionId && !ids.has(section.parentSectionId)) issues.push("MISSING_PARENT_SECTION");
      const ancestors = new Set<string>([section.id]);
      let parentId = section.parentSectionId;
      while (parentId && byId.has(parentId)) {
        if (ancestors.has(parentId)) { issues.push("CYCLIC_SECTION_STRUCTURE"); break; }
        ancestors.add(parentId);
        parentId = byId.get(parentId)?.parentSectionId;
      }
      const drafts = await this.manuscripts.listDraftVersions(actor, section.id);
      if (!drafts.length) { issues.push("MISSING_SECTION_DRAFT"); continue; }
      if (drafts.length > 200 || provenance.length + drafts.length > 1000) {
        throw new ForbiddenException("Draft history exceeds bounded local analysis.");
      }
      if (new Set(drafts.map((draft) => draft.version)).size !== drafts.length) issues.push("DUPLICATE_DRAFT_VERSION");
      for (const [index, draft] of drafts.entries()) {
        if (!Number.isInteger(draft.version) || draft.version < 1 || draft.manuscriptId !== manuscript.id ||
          draft.sectionId !== section.id) issues.push("INVALID_DRAFT_VERSION_REFERENCE");
        if (draft.version !== index + 1) issues.push("NON_CONTIGUOUS_DRAFT_HISTORY");
        if (draft.characterCount !== draft.content.length ||
          draft.wordCount !== draft.content.trim().split(/\s+/u).filter(Boolean).length) issues.push("INVALID_DRAFT_TEXT_COUNTS");
        provenance.push({ resourceType: "DRAFT", resourceId: draft.id, version: String(draft.version) });
      }
    }
    return { readiness: issues.length ? "READY_WITH_WARNINGS" as const : "READY" as const,
      issues: [...new Set(issues)], humanApprovalRequired: true as const,
      metrics: { sectionCount: sections.length }, provenance };
  }
}
