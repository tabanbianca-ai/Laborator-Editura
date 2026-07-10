export type DictionarySourceType =
  | "ACADEMIC_DICTIONARY"
  | "BILINGUAL_DICTIONARY"
  | "CORPUS"
  | "EDITORIAL_GUIDE"
  | "GRAMMAR_RULES"
  | "MONOLINGUAL_DICTIONARY"
  | "MORPHOLOGICAL_DICTIONARY"
  | "ORTHOEPIC_DICTIONARY"
  | "ORTHOGRAPHIC_DICTIONARY"
  | "PHRASEOLOGICAL_DICTIONARY"
  | "PUNCTUATION_RULES"
  | "SPECIALIZED_GLOSSARY"
  | "SPECIALIZED_SPIRITIST_DICTIONARY"
  | "TERMINOLOGY_DATABASE";

export type DictionarySourceCatalogKey = "CALCIU_SAMHARADZE_ES_RO_RO_ES";

export type LexicographicAuthority =
  | "VALIDATED_PLATFORM_GLOSSARY"
  | "DOCUMENTED_EDITORIAL_DECISION"
  | "SPECIALIZED_DICTIONARY"
  | "ACADEMIC_DICTIONARY"
  | "AI_SUGGESTION";

export type LinguisticAuthorityLevel =
  | "OFFICIAL_NORMATIVE"
  | "ACADEMIC"
  | "VALIDATED_SPECIALIZED"
  | "EDITORIAL_GUIDE"
  | "DESCRIPTIVE"
  | "INFORMATIVE";

export type LinguisticContentAccessMode =
  | "EXTERNAL_CONTROLLED_ACCESS"
  | "INTEGRATED_CONTENT";

export type LinguisticLicenseStatus =
  | "INGESTION_PERMITTED"
  | "METADATA_ONLY"
  | "RESTRICTED"
  | "UNKNOWN";

export type LinguisticRedistributionPermission =
  | "ALLOWED"
  | "EXCERPTS_ONLY"
  | "INTERNAL_USE_ONLY"
  | "NOT_ALLOWED"
  | "UNKNOWN";

export type LinguisticSearchMode =
  | "EXACT"
  | "FUZZY"
  | "MORPHOLOGICAL"
  | "NORMALIZED";

export type LinguisticResourceReadinessStatus =
  | "BLOCKED"
  | "READY"
  | "READY_WITH_WARNINGS";

export type LexicographicAuditAction =
  | "COMPARE_SENSES"
  | "CREATE_ENTRY"
  | "CREATE_SOURCE"
  | "DICTIONARY_CONFLICT"
  | "ENTRY_IMPORTED"
  | "HUMAN_OVERRIDE"
  | "LICENSE_CHANGED"
  | "LIST_SOURCES"
  | "RESOURCE_ADDED"
  | "RESOURCE_DISABLED"
  | "RESOURCE_UPDATED"
  | "SEARCH_ENTRIES"
  | "SOURCE_CONSULTED"
  | "TERMINOLOGY_DECISION"
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
  projectId?: string;
  type: DictionarySourceType;
  catalogKey?: DictionarySourceCatalogKey;
  title: string;
  authors: string[];
  language?: string;
  languagePair?: {
    sourceLanguage: string;
    targetLanguage: string;
  };
  sourceLanguages: string[];
  targetLanguages: string[];
  authority: LexicographicAuthority;
  publisher?: string;
  publisherOrInstitution?: string;
  issuingInstitution?: string;
  edition?: string;
  publicationYear?: number;
  version?: string;
  sourceUrl?: string;
  importedDocumentRef?: string;
  licenseStatus: LinguisticLicenseStatus;
  copyrightHolder?: string;
  redistributionPermission: LinguisticRedistributionPermission;
  authorityLevel: LinguisticAuthorityLevel;
  domain?: string;
  effectiveDate?: string;
  lastVerificationDate?: string;
  enabled: boolean;
  accessMode: LinguisticContentAccessMode;
  authorizedApiIntegration?: string;
  officialLink?: string;
  permittedExcerpts?: string[];
  accessRestrictions?: string[];
  licenseNotes?: string;
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
  grammaticalCategory?: string;
  inflection?: string;
  pronunciation?: string;
  usageLabels?: string[];
  idioms?: string[];
  synonyms?: string[];
  antonyms?: string[];
  etymology?: string;
  domain?: string;
  register?: string;
  notes?: string;
  citationIds: string[];
}

export interface DictionaryEntry {
  id: string;
  organizationId: string;
  projectId?: string;
  sourceId: string;
  term: string;
  headword?: string;
  normalizedTerm: string;
  sourceLanguage: string;
  targetLanguage?: string;
  senses: LexicalSense[];
  citations: LexicographicCitation[];
  grammaticalCategory?: string;
  inflection?: string;
  pronunciation?: string;
  usageLabels?: string[];
  idioms?: string[];
  synonyms?: string[];
  antonyms?: string[];
  etymology?: string;
  bilingualEquivalents?: string[];
  sourceEdition?: string;
  domain?: string;
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
  authorityLevel?: LinguisticAuthorityLevel;
  sourceTitle?: string;
  sourceEdition?: string;
  publicationYear?: number;
  licenseStatus?: LinguisticLicenseStatus;
  accessMode?: LinguisticContentAccessMode;
  lastVerificationDate?: string;
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
  sourcePriorityRule?: LinguisticAuthorityLevel[];
  conflicts?: LexicographicSourceConflict[];
}

export interface LexicographicSourceConflict {
  term: string;
  entryIds: string[];
  sourceIds: string[];
  authorityLevels: LinguisticAuthorityLevel[];
  message: string;
  humanReviewRequired: true;
}

export interface LinguisticResourceReadinessIssue {
  sourceId: string;
  title: string;
  issue:
    | "DISABLED_RESOURCE"
    | "OUTDATED_VERIFICATION"
    | "UNAUTHORIZED_SOURCE"
    | "UNKNOWN_LICENSE";
  message: string;
}

export interface LinguisticResourceReadinessReport {
  projectId?: string;
  status: LinguisticResourceReadinessStatus;
  consultedSourceIds: string[];
  issues: LinguisticResourceReadinessIssue[];
  qualityAgentReportsOnly: true;
  humanFinalAuthority: true;
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
  projectId?: string;
  type?: DictionarySourceType;
  catalogKey?: DictionarySourceCatalogKey;
  title?: string;
  authors?: string[];
  language?: string;
  sourceLanguages?: string[];
  targetLanguages?: string[];
  authority?: LexicographicAuthority;
  publisher?: string;
  publisherOrInstitution?: string;
  issuingInstitution?: string;
  edition?: string;
  publicationYear?: number;
  version?: string;
  sourceUrl?: string;
  importedDocumentRef?: string;
  licenseStatus?: LinguisticLicenseStatus;
  copyrightHolder?: string;
  redistributionPermission?: LinguisticRedistributionPermission;
  authorityLevel?: LinguisticAuthorityLevel;
  domain?: string;
  effectiveDate?: string;
  lastVerificationDate?: string;
  enabled?: boolean;
  accessMode?: LinguisticContentAccessMode;
  authorizedApiIntegration?: string;
  officialLink?: string;
  permittedExcerpts?: string[];
  accessRestrictions?: string[];
  licenseNotes?: string;
  sourceReference?: string;
  citationFormat?: string;
  notes?: string;
  metadata?: Record<string, unknown>;
}

export interface CreateDictionaryEntryInput {
  sourceId: string;
  term: string;
  projectId?: string;
  headword?: string;
  sourceLanguage: string;
  targetLanguage?: string;
  grammaticalCategory?: string;
  inflection?: string;
  pronunciation?: string;
  usageLabels?: string[];
  idioms?: string[];
  synonyms?: string[];
  antonyms?: string[];
  etymology?: string;
  bilingualEquivalents?: string[];
  sourceEdition?: string;
  domain?: string;
  senses?: Array<{
    id?: string;
    definition: string;
    sourceLanguage?: string;
    targetLanguage?: string;
    translationEquivalents?: string[];
    examples?: string[];
    grammaticalCategory?: string;
    inflection?: string;
    pronunciation?: string;
    usageLabels?: string[];
    idioms?: string[];
    synonyms?: string[];
    antonyms?: string[];
    etymology?: string;
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
  projectId?: string;
  phrase?: string;
  idiom?: string;
  languagePair?: string;
  domain?: string;
  grammaticalCategory?: string;
  sourceId?: string;
  edition?: string;
  authorityLevel?: LinguisticAuthorityLevel;
  searchMode?: LinguisticSearchMode;
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
  updateSource(source: DictionarySource): Promise<DictionarySource>;
  listSources(organizationId: string): Promise<DictionarySource[]>;
  findSourceById(id: string, organizationId: string): Promise<DictionarySource | null>;
  createEntry(entry: DictionaryEntry): Promise<DictionaryEntry>;
  searchEntries(input: SearchDictionaryEntriesInput & { organizationId: string }): Promise<DictionaryEntry[]>;
  findEntriesByIds(ids: string[], organizationId: string): Promise<DictionaryEntry[]>;
  createDecision(decision: LexicographicDecision): Promise<LexicographicDecision>;
  appendAuditEvent(event: LexicographicAuditEvent): Promise<void>;
}

export const LINGUISTIC_SOURCE_PRIORITY_RULE: LinguisticAuthorityLevel[] = [
  "OFFICIAL_NORMATIVE",
  "ACADEMIC",
  "VALIDATED_SPECIALIZED",
  "EDITORIAL_GUIDE",
  "DESCRIPTIVE",
  "INFORMATIVE"
];

export const ROMANIAN_LINGUISTIC_SOURCE_PROFILE = {
  language: "ro",
  configurableSources: [
    "DOOM editions",
    "DEX-type explanatory resources",
    "official Romanian grammar rules",
    "orthographic and punctuation rules",
    "Romanian bilingual dictionaries",
    "phraseological dictionaries",
    "specialized dictionaries"
  ],
  copyrightRule:
    "Do not hardcode copyrighted content; register metadata and ingest content only when rights allow it."
};

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
