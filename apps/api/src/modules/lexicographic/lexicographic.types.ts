export type DictionarySourceType =
  | "ACADEMIC_DICTIONARY"
  | "BILINGUAL_DICTIONARY"
  | "MONOLINGUAL_DICTIONARY"
  | "SPECIALIZED_SPIRITIST_DICTIONARY";

export type DictionarySourceCatalogKey = "CALCIU_SAMHARADZE_ES_RO_RO_ES";

export type LexicographicAuthority =
  | "VALIDATED_PLATFORM_GLOSSARY"
  | "DOCUMENTED_EDITORIAL_DECISION"
  | "SPECIALIZED_DICTIONARY"
  | "ACADEMIC_DICTIONARY"
  | "AI_SUGGESTION";

export type LexicographicAuditAction =
  | "COMPARE_SENSES"
  | "CREATE_ENTRY"
  | "CREATE_SOURCE"
  | "LIST_SOURCES"
  | "SEARCH_ENTRIES"
  | "VALIDATE_TERM";

export type LexicographicDecisionStatus =
  | "PENDING_HUMAN_APPROVAL"
  | "APPROVED_BY_HUMAN"
  | "REJECTED";

export interface LexicographicActor {
  userId: string;
  organizationId: string;
  roles?: string[];
}

export interface DictionarySource {
  id: string;
  organizationId: string;
  type: DictionarySourceType;
  catalogKey?: DictionarySourceCatalogKey;
  title: string;
  authors: string[];
  sourceLanguages: string[];
  targetLanguages: string[];
  authority: LexicographicAuthority;
  publisher?: string;
  publicationYear?: number;
  sourceReference?: string;
  citationFormat?: string;
  notes?: string;
  createdBy: string;
  createdAt: string;
  metadata?: Record<string, unknown>;
}

export interface LexicographicCitation {
  id: string;
  sourceId: string;
  sourceReference: string;
  pageOrSection?: string;
  quote?: string;
  url?: string;
  createdAt: string;
}

export interface LexicalSense {
  id: string;
  definition: string;
  sourceLanguage: string;
  targetLanguage?: string;
  translationEquivalents: string[];
  examples: string[];
  domain?: string;
  register?: string;
  notes?: string;
  citationIds: string[];
}

export interface DictionaryEntry {
  id: string;
  organizationId: string;
  sourceId: string;
  term: string;
  normalizedTerm: string;
  sourceLanguage: string;
  targetLanguage?: string;
  senses: LexicalSense[];
  citations: LexicographicCitation[];
  createdBy: string;
  createdAt: string;
  metadata?: Record<string, unknown>;
}

export interface LexicographicAuthorityEvidence {
  authority: LexicographicAuthority;
  entryId?: string;
  senseId?: string;
  decision?: string;
  notes?: string;
  humanApproved?: boolean;
}

export interface LexicographicDecision {
  id: string;
  organizationId: string;
  term: string;
  sourceLanguage: string;
  targetLanguage?: string;
  selectedAuthority: LexicographicAuthority;
  selectedEntryId?: string;
  selectedSenseId?: string;
  decision: string;
  rationale: string;
  priorityRule: LexicographicAuthority[];
  status: LexicographicDecisionStatus;
  humanFinalAuthority: true;
  decidedBy: string;
  decidedAt: string;
  metadata?: Record<string, unknown>;
}

export interface LexicographicSenseComparison {
  entryId: string;
  sourceId: string;
  senseId: string;
  definition: string;
  translationEquivalents: string[];
  authority: LexicographicAuthority;
  priorityRank: number;
  citations: LexicographicCitation[];
}

export interface LexicographicEntryEvidence {
  entryId: string;
  sourceId: string;
  term: string;
  sourceLanguage: string;
  targetLanguage?: string;
  senseIds: string[];
  translationEquivalents: string[];
  sourceReferences: string[];
  citations: LexicographicCitation[];
  authority: LexicographicAuthority;
  priorityRank: number;
  authoritative: false;
  humanFinalAuthority: true;
}

export interface LexicographicCompareResult {
  term: string;
  sourceLanguage: string;
  targetLanguage?: string;
  comparisons: LexicographicSenseComparison[];
  priorityRule: LexicographicAuthority[];
}

export interface LexicographicAuditEvent {
  id: string;
  organizationId: string;
  action: LexicographicAuditAction;
  actorId: string;
  entityType: "dictionary_entry" | "dictionary_source" | "lexicographic_decision" | "lexicographic_query";
  entityId: string;
  beforeState?: object;
  afterState?: object;
  createdAt: string;
}

export interface CreateDictionarySourceInput {
  type?: DictionarySourceType;
  catalogKey?: DictionarySourceCatalogKey;
  title?: string;
  authors?: string[];
  sourceLanguages?: string[];
  targetLanguages?: string[];
  authority?: LexicographicAuthority;
  publisher?: string;
  publicationYear?: number;
  sourceReference?: string;
  citationFormat?: string;
  notes?: string;
  metadata?: Record<string, unknown>;
}

export interface CreateDictionaryEntryInput {
  sourceId: string;
  term: string;
  sourceLanguage: string;
  targetLanguage?: string;
  senses?: Array<{
    id?: string;
    definition: string;
    sourceLanguage?: string;
    targetLanguage?: string;
    translationEquivalents?: string[];
    examples?: string[];
    domain?: string;
    register?: string;
    notes?: string;
    citationIds?: string[];
  }>;
  citations?: Array<{
    id?: string;
    sourceReference: string;
    pageOrSection?: string;
    quote?: string;
    url?: string;
  }>;
  metadata?: Record<string, unknown>;
}

export interface SearchDictionaryEntriesInput {
  term: string;
  sourceLanguage: string;
  targetLanguage?: string;
  limit?: number;
}

export interface CompareLexicalSensesInput {
  term: string;
  sourceLanguage: string;
  targetLanguage?: string;
  entryIds?: string[];
}

export interface ValidateLexicographicTermInput {
  term: string;
  sourceLanguage: string;
  targetLanguage?: string;
  evidences: LexicographicAuthorityEvidence[];
  decision?: string;
  rationale?: string;
  metadata?: Record<string, unknown>;
}

export interface LexicographicRepository {
  createSource(source: DictionarySource): Promise<DictionarySource>;
  listSources(organizationId: string): Promise<DictionarySource[]>;
  findSourceById(id: string, organizationId: string): Promise<DictionarySource | null>;
  createEntry(entry: DictionaryEntry): Promise<DictionaryEntry>;
  searchEntries(input: SearchDictionaryEntriesInput & { organizationId: string }): Promise<DictionaryEntry[]>;
  findEntriesByIds(ids: string[], organizationId: string): Promise<DictionaryEntry[]>;
  createDecision(decision: LexicographicDecision): Promise<LexicographicDecision>;
  appendAuditEvent(event: LexicographicAuditEvent): Promise<void>;
}

export const CALCIU_SAMHARADZE_DICTIONARY_REFERENCE = {
  catalogKey: "CALCIU_SAMHARADZE_ES_RO_RO_ES" as const,
  title: "Dicționar spaniol-român și român-spaniol",
  authors: ["Alexandru Calciu", "Zaira Samharadze"],
  sourceLanguages: ["es", "ro"],
  targetLanguages: ["ro", "es"]
};

export const LEXICOGRAPHIC_PRIORITY_RULE: LexicographicAuthority[] = [
  "VALIDATED_PLATFORM_GLOSSARY",
  "DOCUMENTED_EDITORIAL_DECISION",
  "SPECIALIZED_DICTIONARY",
  "ACADEMIC_DICTIONARY",
  "AI_SUGGESTION"
];
