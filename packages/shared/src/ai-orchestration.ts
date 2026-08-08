export const AI_ORCHESTRATION_SCHEMA_VERSION = "1.0.0" as const;

export type AiAgentType =
  | "AUDIO_AGENT"
  | "CORRECTION_AGENT"
  | "DOCUMENTATION_AGENT"
  | "EDITORIAL_REVIEW_AGENT"
  | "ILLUSTRATION_AGENT"
  | "METADATA_AGENT"
  | "MONITORING_AGENT"
  | "PUBLICATION_AGENT"
  | "SCHEDULING_AGENT"
  | "TERMINOLOGY_AGENT"
  | "TRANSLATION_AGENT"
  | "VIDEO_AGENT";

export type AiRiskLevel = "CRITICAL" | "HIGH" | "LOW" | "MEDIUM";

export type AiHumanReviewPolicy =
  | "AI_NOT_ALLOWED"
  | "AUTO_ACCEPT_ALLOWED"
  | "DUAL_REVIEW_REQUIRED"
  | "HUMAN_REVIEW_REQUIRED";

export type AiRegistryStatus = "ACTIVE" | "ARCHIVED" | "DISABLED" | "DRAFT" | "QUARANTINED" | "UNDER_REVIEW";

export type AiModelType =
  | "EMBEDDING_MODEL"
  | "IMAGE_MODEL"
  | "LANGUAGE_MODEL"
  | "RERANKER"
  | "SPEECH_MODEL"
  | "VIDEO_MODEL";

export type AiModality = "AUDIO" | "IMAGE" | "TEXT" | "VIDEO";

export type AiAvailabilityStatus = "AVAILABLE" | "CONFIGURED_OUTAGE" | "DEGRADED" | "RATE_LIMITED" | "UNAVAILABLE";

export type AiExecutionStatus = "BLOCKED" | "COMPLETED" | "FAILED" | "PENDING_REVIEW" | "RUNNING" | "STARTED";

export type AiReviewStatus = "ACCEPTED" | "NOT_REQUIRED" | "PENDING" | "REJECTED";

export type KnowledgeSourceType =
  | "APPROVED_TRANSLATIONS"
  | "DOCUMENTATION"
  | "EDITORIAL_LIBRARY"
  | "POLICIES"
  | "PROJECT_DOCUMENTS"
  | "TERMINOLOGY";

export type AiDataClassification =
  | "CONFIDENTIAL"
  | "INTERNAL"
  | "PUBLIC"
  | "RESTRICTED"
  | "SENSITIVE";

export type RagIndexingPolicy = "AUTOMATIC_IF_ELIGIBLE" | "MANUAL_APPROVAL_REQUIRED" | "NEVER_INDEX";

export type RagRefreshPolicy = "MANUAL" | "ON_SOURCE_CHANGE" | "SCHEDULED";

export type RagCollectionStatus = "ACTIVE" | "DISABLED" | "DRAFT" | "QUARANTINED";

export type RagVectorStatus = "ACTIVE" | "OUTDATED" | "QUARANTINED" | "REINDEXING";

export type ToolSideEffect = "EXTERNAL_CALL" | "NONE" | "READ" | "WRITE";

export type ToolAuthorizationDecision = "ALLOW" | "DENY" | "REQUIRE_HUMAN_APPROVAL";

export type AiEvaluationMetric =
  | "CONSISTENCY"
  | "FALSE_POSITIVE_RATE"
  | "HALLUCINATION_RATE"
  | "OMISSION_RATE"
  | "PRECISION"
  | "RECALL"
  | "SEMANTIC_FIDELITY"
  | "STYLE_COMPLIANCE"
  | "TERMINOLOGY"
  | "UNWANTED_MEANING_CHANGE";

export type AiBudgetScope = "AGENT" | "ORGANIZATION" | "PLATFORM" | "PROJECT" | "WORKFLOW";

export type AiBudgetStatus = "ACTIVE" | "EXCEEDED" | "SUSPENDED" | "WARNING";

export type AiCostGateDecision = "ALLOW" | "BLOCK_HARD_LIMIT" | "REQUIRE_APPROVED_FALLBACK" | "WARN_SOFT_LIMIT";

export type AiDataProtectionAction =
  | "ALLOW"
  | "BLOCK_EXTERNAL_AI"
  | "LOCAL_MODEL_ONLY"
  | "PSEUDONYMIZE"
  | "REDACT";

export type AiRetentionSubject =
  | "EMBEDDING"
  | "EVALUATION_DATA"
  | "INPUT"
  | "LOG"
  | "OUTPUT"
  | "PROMPT"
  | "PROVIDER_RESPONSE";

export type AiAuditEventName =
  | "AIBudgetThresholdReached"
  | "AIExecutionBlocked"
  | "AIExecutionCompleted"
  | "AIExecutionFailed"
  | "AIExecutionRequested"
  | "AIExecutionStarted"
  | "AIModelChanged"
  | "AIOutputAccepted"
  | "AIOutputRejected"
  | "AIOutputReviewed"
  | "AIPromptChanged"
  | "AIToolCalled"
  | "AIToolDenied"
  | "RAGSourceIndexed"
  | "RAGSourceRemoved";

export type AiMetricName =
  | "ai_budget_consumption"
  | "ai_cost"
  | "ai_failure_rate"
  | "ai_human_rejection_rate"
  | "ai_latency"
  | "ai_regression_failure_rate"
  | "ai_request_count"
  | "ai_success_rate"
  | "ai_token_usage"
  | "ai_tool_denial_rate"
  | "rag_retrieval_latency"
  | "rag_stale_record_count";

export type AiIncidentCategory =
  | "COST_ANOMALY"
  | "DATA_LEAK"
  | "HALLUCINATION"
  | "POLICY_BYPASS"
  | "PROMPT_INJECTION"
  | "PROVIDER_FAILURE"
  | "QUALITY_REGRESSION"
  | "UNAUTHORIZED_ACCESS_ATTEMPT";

export type AiKillSwitchTargetType =
  | "AGENT"
  | "EXECUTION_TYPE"
  | "MODEL"
  | "PROVIDER"
  | "RAG_SOURCE"
  | "TOOL";

export type LegacyAiClassification =
  | "CANONICAL"
  | "DIRECT_PROVIDER_CALL"
  | "LEGACY_AI"
  | "ORPHANED"
  | "RIGHTS_UNKNOWN"
  | "SECURITY_REVIEW_REQUIRED"
  | "UNCONTROLLED_RAG"
  | "UNTRACKED_COST"
  | "UNVERSIONED_PROMPT";

export interface AIAgentDefinition {
  id: string;
  canonicalName: string;
  agentType: AiAgentType;
  purpose: string;
  owningModule: string;
  allowedOperations: string[];
  allowedTools: string[];
  allowedModels: string[];
  allowedKnowledgeSources: string[];
  requiredPermissions: string[];
  riskLevel: AiRiskLevel;
  humanReviewPolicy: AiHumanReviewPolicy;
  status: AiRegistryStatus;
  version: string;
  maxCostPerExecution?: number;
  timeoutSeconds?: number;
}

export interface AIProviderDefinition {
  id: string;
  canonicalName: string;
  supportedModels: string[];
  authenticationReference: string;
  dataProcessingTerms: string;
  region: string;
  retentionPolicy: string;
  availabilityStatus: AiAvailabilityStatus;
  rateLimits: Record<string, number>;
  costCurrency: string;
  owner: string;
}

export interface AIModelDefinition {
  id: string;
  providerId: string;
  providerModelId: string;
  modelVersion: string;
  modelType: AiModelType;
  modalities: AiModality[];
  supportedLanguages: string[];
  contextLimit: number;
  capabilities: string[];
  riskProfile: AiRiskLevel;
  costProfile: CostProfile;
  latencyProfile: string;
  dataProcessingPolicy: string;
  status: AiRegistryStatus;
}

export interface CostProfile {
  inputUnitCost: number;
  outputUnitCost: number;
  currency: string;
}

export interface PromptDefinition {
  id: string;
  canonicalName: string;
  agentId: string;
  purpose: string;
  systemInstructionsReference: string;
  inputSchema: JsonSchemaReference;
  outputSchema: JsonSchemaReference;
  supportedModels: string[];
  languagePolicy: string;
  constraints: string[];
  evaluationProfileId: string;
  riskLevel: AiRiskLevel;
  status: AiRegistryStatus;
  version: string;
}

export interface JsonSchemaReference {
  schemaId: string;
  schemaVersion: string;
  requiredFields: string[];
  optionalFields?: string[];
}

export interface StructuredAIOutput {
  findingId?: string;
  category?: string;
  severity?: AiRiskLevel;
  sourceReference?: SourceCitation;
  suggestion?: string;
  explanation?: string;
  confidence?: number;
  freeTextAllowed?: boolean;
}

export interface SourceCitation {
  sourceResourceId: string;
  sourceVersionId: string;
  blockId?: string;
  retrievalScore?: number;
}

export interface AIExecutionRecord {
  id: string;
  organizationId: string;
  agentId: string;
  agentVersion: string;
  modelId: string;
  modelVersion: string;
  promptId: string;
  promptVersion: string;
  projectId?: string;
  publicationId?: string;
  sourceResourceIds: string[];
  sourceVersions: string[];
  startedAt: string;
  completedAt?: string;
  status: AiExecutionStatus;
  inputTokenCount: number;
  outputTokenCount: number;
  cost: number;
  currency: string;
  correlationId: string;
  reviewStatus: AiReviewStatus;
  sensitivePromptContentStored: false;
}

export interface KnowledgeSourceDefinition {
  id: string;
  organizationId: string;
  canonicalName: string;
  sourceType: KnowledgeSourceType;
  owningModule: string;
  classification: AiDataClassification;
  organizationScope: "SINGLE_ORGANIZATION";
  rightsRecordId?: string;
  aiProcessingAllowed: boolean;
  indexingPolicy: RagIndexingPolicy;
  refreshPolicy: RagRefreshPolicy;
  status: AiRegistryStatus;
}

export interface RagEligibilityInput {
  userHasAccess: boolean;
  aiProcessingAllowed: boolean;
  sourceIsSupported: boolean;
  classificationPolicyPassed: boolean;
}

export interface RagCollection {
  id: string;
  organizationId: string;
  canonicalName: string;
  purpose: string;
  sourceRegistryIds: string[];
  embeddingModelId: string;
  chunkingProfileId: string;
  retrievalProfileId: string;
  accessPolicy: RetrievalPolicy;
  refreshPolicy: RagRefreshPolicy;
  status: RagCollectionStatus;
  version: string;
  crossOrganizationAllowed: false;
}

export interface ChunkingProfile {
  id: string;
  organizationId: string;
  chunkStrategy: string;
  targetSize: number;
  overlap: number;
  semanticBoundaries: boolean;
  preserveHeadings: boolean;
  preserveBlockIds: true;
  language: string;
  metadataFields: string[];
  version: string;
}

export interface VectorRecord {
  id: string;
  organizationId: string;
  collectionId: string;
  sourceResourceId: string;
  sourceVersionId: string;
  sourceBlockIds: string[];
  chunkHash: string;
  embeddingModelId: string;
  embeddingModelVersion: string;
  classification: AiDataClassification;
  rightsReference?: string;
  indexedAt: string;
  status: RagVectorStatus;
}

export interface RetrievalPolicy {
  organizationId: string;
  projectId?: string;
  roles: string[];
  allowedClassifications: AiDataClassification[];
  requiredRights: string[];
  languages: string[];
  approvedSourceIds: string[];
  sourceVersionPolicy: "ACTIVE_ONLY" | "ACTIVE_OR_HISTORICAL" | "EXACT_VERSION";
}

export interface RetrievalRequestContext {
  organizationId: string;
  projectId?: string;
  roles: string[];
  classificationsAllowed: AiDataClassification[];
  rightsReferences: string[];
  languages: string[];
  accessibleSourceIds: string[];
  sourceVersionPolicy: RetrievalPolicy["sourceVersionPolicy"];
}

export interface ToolDefinition {
  id: string;
  canonicalName: string;
  operation: string;
  owningModule: string;
  requiredPermissions: string[];
  riskLevel: AiRiskLevel;
  inputSchema: JsonSchemaReference;
  outputSchema: JsonSchemaReference;
  sideEffects: ToolSideEffect[];
  humanApprovalPolicy: AiHumanReviewPolicy;
  status: AiRegistryStatus;
}

export interface ToolCallRequest {
  id: string;
  organizationId: string;
  agentId: string;
  toolId: string;
  identityId: string;
  delegatedBy?: string;
  permissions: string[];
  resourceScope: string[];
  policyContext: string[];
  requestedAt: string;
}

export interface ToolAuthorizationResult {
  decision: ToolAuthorizationDecision;
  reasons: string[];
}

export interface OrchestratorRequest {
  id: string;
  organizationId: string;
  identityId: string;
  projectId?: string;
  intent: string;
  taskType: string;
  sourceResourceIds: string[];
  sourceVersions: string[];
  requiredPermissions: string[];
  dataClassification: AiDataClassification;
  rightsRecordIds: string[];
  aiProcessingAllowed: boolean;
  correlationId: string;
}

export interface OrchestratorDecision {
  requestId: string;
  allowed: boolean;
  blockedReasons: string[];
  selectedAgentId?: string;
  selectedModelId?: string;
  selectedPromptId?: string;
  selectedToolIds: string[];
  humanReviewPolicy: AiHumanReviewPolicy;
  manualFallbackAvailable: boolean;
}

export interface ModelRoutingInput {
  taskType: string;
  language: string;
  modality: AiModality;
  dataClassification: AiDataClassification;
  requiredCapabilities: string[];
  requiredQuality: number;
  riskLevel: AiRiskLevel;
  maxLatencyMs?: number;
  maxCost?: number;
  availableModels: AIModelDefinition[];
  providers: AIProviderDefinition[];
}

export interface ProviderFallbackPolicy {
  primaryModelId: string;
  secondaryModelIds: string[];
  optionalThirdModelIds: string[];
  allowedDataClassifications: AiDataClassification[];
  allowedModalities: AiModality[];
  allowedLanguages: string[];
}

export interface EvaluationProfile {
  id: string;
  organizationId: string;
  agentId: string;
  datasetIds: string[];
  metrics: AiEvaluationMetric[];
  thresholds: Record<AiEvaluationMetric, number>;
  reviewPolicy: AiHumanReviewPolicy;
  version: string;
  status: AiRegistryStatus;
  linkedPromptVersion?: string;
  linkedModelVersion?: string;
}

export interface EvaluationDataset {
  id: string;
  organizationId: string;
  canonicalName: string;
  domain: string;
  languages: string[];
  cases: string[];
  expectedBehavior: string;
  source: string;
  rightsStatus: "APPROVED" | "BLOCKED" | "UNKNOWN";
  version: string;
}

export interface RegressionRun {
  id: string;
  organizationId: string;
  changedAssetType: "AGENT" | "CHUNKING" | "MODEL" | "PROMPT" | "RAG" | "TOOL";
  changedAssetId: string;
  evaluationProfileIds: string[];
  degradationThresholdExceeded: boolean;
  promotedToProduction: boolean;
  completedAt: string;
}

export interface ShadowEvaluationRun {
  id: string;
  organizationId: string;
  productionModelId: string;
  candidateModelId: string;
  userFacingResultFromProductionOnly: true;
  comparisonMetrics: Record<string, number>;
  createdAt: string;
}

export interface AICostRecord {
  id: string;
  organizationId: string;
  providerId: string;
  modelId: string;
  agentId: string;
  projectId?: string;
  publicationId?: string;
  executionId: string;
  inputUnits: number;
  outputUnits: number;
  cachedUnits: number;
  cost: number;
  currency: string;
  timestamp: string;
}

export interface AIBudget {
  id: string;
  organizationId: string;
  scope: AiBudgetScope;
  scopeId: string;
  period: "DAILY" | "MONTHLY" | "PER_RUN";
  softLimit: number;
  hardLimit: number;
  currency: string;
  status: AiBudgetStatus;
}

export interface AIUsageQuota {
  id: string;
  organizationId: string;
  scope: AiBudgetScope;
  scopeId: string;
  maxRequests?: number;
  maxTokensOrUnits?: number;
  maxImageGenerations?: number;
  maxAudioSeconds?: number;
  maxVideoJobs?: number;
  maxConcurrency?: number;
  dailyLimit?: number;
  monthlyLimit?: number;
  status: AiRegistryStatus;
}

export interface SemanticCacheEntry {
  id: string;
  organizationId: string;
  agentVersion: string;
  promptVersion: string;
  modelVersion: string;
  sourceVersion: string;
  inputHash: string;
  policyContext: string;
  cacheKey: string;
  resultReference: string;
  createdAt: string;
}

export interface AIDataPolicy {
  id: string;
  organizationId: string;
  classification: AiDataClassification;
  externalProviderAction: AiDataProtectionAction;
  allowedProviderIds: string[];
  localModelRequired: boolean;
  retentionPolicyId: string;
  status: AiRegistryStatus;
}

export interface ProviderDataPolicy {
  id: string;
  organizationId: string;
  providerId: string;
  dataReceived: string[];
  processingRegion: string;
  retention: string;
  trainingUsePolicy: "ALLOWED" | "NOT_ALLOWED" | "UNKNOWN";
  deletionPolicy: string;
  transferPolicy: string;
  status: AiRegistryStatus;
}

export interface AIAuditEvent {
  id: string;
  organizationId: string;
  eventName: AiAuditEventName;
  actorId?: string;
  executionId?: string;
  agentId?: string;
  modelId?: string;
  promptId?: string;
  toolId?: string;
  createdAt: string;
  metadata?: Record<string, unknown>;
}

export interface AIObservabilityMetric {
  id: string;
  organizationId: string;
  metricName: AiMetricName;
  value: number;
  unit: string;
  recordedAt: string;
  metadata?: Record<string, unknown>;
}

export interface AIQualityDashboardSnapshot {
  id: string;
  organizationId: string;
  agentId: string;
  modelId: string;
  promptVersion: string;
  volume: number;
  cost: number;
  latencyMs: number;
  humanAcceptanceRate: number;
  humanRejectionRate: number;
  errorCount: number;
  evaluationScore: number;
  driftSignals: string[];
  incidentIds: string[];
  createdAt: string;
}

export interface AIIncident {
  id: string;
  organizationId: string;
  agentId: string;
  modelId: string;
  category: AiIncidentCategory;
  severity: AiRiskLevel;
  affectedResources: string[];
  detectedAt: string;
  status: "CONTAINED" | "OPEN" | "RESOLVED";
  containment: string;
  rootCause?: string;
  correctiveAction?: string;
  evidence: string[];
}

export interface KillSwitch {
  id: string;
  organizationId: string;
  targetType: AiKillSwitchTargetType;
  targetId: string;
  disabled: boolean;
  reason: string;
  activatedBy: string;
  activatedAt: string;
}

export interface AgentCommunicationContract {
  id: string;
  organizationId: string;
  senderAgentId: string;
  receiverAgentId: string;
  taskType: string;
  inputSchema: JsonSchemaReference;
  expectedOutputSchema: JsonSchemaReference;
  correlationId: string;
  permissions: string[];
}

export interface AIWorkflowTrace {
  id: string;
  organizationId: string;
  workflowExecutionId: string;
  step: number;
  agentId: string;
  modelId: string;
  inputReference: string;
  outputReference: string;
  decision: string;
  durationMs: number;
  cost: number;
  currency: string;
  reviewStatus: AiReviewStatus;
}

export interface AIChangeRecord {
  id: string;
  organizationId: string;
  changeType: "AGENT_BEHAVIOR" | "MODEL" | "PROMPT" | "PROVIDER" | "RAG_POLICY" | "TOOL_PERMISSIONS";
  changedResourceId: string;
  reason: string;
  regressionRunId?: string;
  approvedBy?: string;
  approvedAt?: string;
  productionReady: boolean;
}

export interface LegacyAiAsset {
  id: string;
  organizationId: string;
  originalReference?: string;
  classification: LegacyAiClassification;
  hasVersionedPrompt: boolean;
  hasProviderRegistryEntry: boolean;
  hasControlledRag: boolean;
  hasCostTracking: boolean;
  rightsKnown: boolean;
  orphaned: boolean;
  reviewNotes?: string;
}

export interface AiValidationIssue {
  code: string;
  message: string;
  severity: AiRiskLevel;
}

export interface AiPolicyValidationResult {
  allowed: boolean;
  issues: AiValidationIssue[];
}

export interface DataPoisoningAssessment {
  sourceId: string;
  status: "ALLOW" | "QUARANTINE" | "REJECT";
  issues: AiValidationIssue[];
}

export function evaluateRagEligibility(input: RagEligibilityInput): AiPolicyValidationResult {
  const issues: AiValidationIssue[] = [];

  addBlockingUnless(input.userHasAccess, "RAG_USER_ACCESS_REQUIRED", "The acting user must have access to the source.", issues);
  addBlockingUnless(input.aiProcessingAllowed, "RAG_AI_PROCESSING_REQUIRED", "AI processing must be allowed for the source.", issues);
  addBlockingUnless(input.sourceIsSupported, "RAG_SOURCE_UNSUPPORTED", "The source type must be supported.", issues);
  addBlockingUnless(input.classificationPolicyPassed, "RAG_CLASSIFICATION_BLOCKED", "Classification policy must pass before indexing.", issues);

  return policyResult(issues);
}

export function detectOutdatedVectors(
  vectors: Pick<VectorRecord, "id" | "sourceResourceId" | "sourceVersionId">[],
  currentSourceVersions: Record<string, string>
): string[] {
  return vectors
    .filter((vector) => currentSourceVersions[vector.sourceResourceId] !== vector.sourceVersionId)
    .map((vector) => vector.id);
}

export function authorizeToolCall(
  tool: ToolDefinition,
  request: Pick<ToolCallRequest, "permissions" | "resourceScope" | "policyContext">
): ToolAuthorizationResult {
  const reasons: string[] = [];

  if (tool.status !== "ACTIVE") {
    reasons.push("TOOL_NOT_ACTIVE");
  }

  for (const permission of tool.requiredPermissions) {
    if (!request.permissions.includes(permission)) {
      reasons.push(`MISSING_PERMISSION:${permission}`);
    }
  }

  if (request.resourceScope.length === 0) {
    reasons.push("RESOURCE_SCOPE_REQUIRED");
  }

  if (request.policyContext.includes("POLICY_DENY")) {
    reasons.push("POLICY_DENY");
  }

  if (reasons.length > 0) {
    return { decision: "DENY", reasons };
  }

  if (tool.humanApprovalPolicy === "HUMAN_REVIEW_REQUIRED" || tool.humanApprovalPolicy === "DUAL_REVIEW_REQUIRED") {
    return { decision: "REQUIRE_HUMAN_APPROVAL", reasons: ["HUMAN_APPROVAL_REQUIRED"] };
  }

  return { decision: "ALLOW", reasons: [] };
}

export function canAutoAcceptAiOutput(input: {
  riskLevel: AiRiskLevel;
  humanReviewPolicy: AiHumanReviewPolicy;
  confidence?: number;
  deterministicLowRiskPolicyApproved?: boolean;
}): boolean {
  if (input.humanReviewPolicy !== "AUTO_ACCEPT_ALLOWED") {
    return false;
  }

  if (input.riskLevel !== "LOW") {
    return false;
  }

  if (input.deterministicLowRiskPolicyApproved !== true) {
    return false;
  }

  return typeof input.confidence === "number" ? input.confidence >= 0 && input.confidence <= 1 : true;
}

export function validateStructuredAiOutput(
  output: StructuredAIOutput,
  schema: JsonSchemaReference
): AiPolicyValidationResult {
  const issues: AiValidationIssue[] = [];

  for (const field of schema.requiredFields) {
    if (output[field as keyof StructuredAIOutput] === undefined) {
      issues.push({
        code: `MISSING_OUTPUT_FIELD:${field}`,
        message: `Structured AI output is missing required field ${field}.`,
        severity: "HIGH"
      });
    }
  }

  if (output.confidence !== undefined && (output.confidence < 0 || output.confidence > 1)) {
    issues.push({
      code: "INVALID_CONFIDENCE",
      message: "Confidence must be between 0 and 1.",
      severity: "MEDIUM"
    });
  }

  return policyResult(issues);
}

export function selectModelForRequest(input: ModelRoutingInput): AIModelDefinition | null {
  const providerById = new Map(input.providers.map((provider) => [provider.id, provider]));

  const candidates = input.availableModels
    .filter((model) => model.status === "ACTIVE")
    .filter((model) => model.modalities.includes(input.modality))
    .filter((model) => model.supportedLanguages.includes(input.language))
    .filter((model) => input.requiredCapabilities.every((capability) => model.capabilities.includes(capability)))
    .filter((model) => riskRank(model.riskProfile) >= riskRank(input.riskLevel))
    .filter((model) => providerById.get(model.providerId)?.availabilityStatus === "AVAILABLE")
    .filter((model) => input.maxLatencyMs === undefined || Number.parseInt(model.latencyProfile, 10) <= input.maxLatencyMs)
    .filter((model) => input.maxCost === undefined || model.costProfile.inputUnitCost + model.costProfile.outputUnitCost <= input.maxCost);

  return candidates.sort((left, right) => {
    const qualityDelta = qualityScore(right, input.requiredQuality) - qualityScore(left, input.requiredQuality);
    if (qualityDelta !== 0) {
      return qualityDelta;
    }

    return totalUnitCost(left) - totalUnitCost(right);
  })[0] ?? null;
}

export function canUseFallbackModel(input: {
  fallbackPolicy: ProviderFallbackPolicy;
  candidateModel: AIModelDefinition;
  dataClassification: AiDataClassification;
  language: string;
  modality: AiModality;
  rightsAllowTransfer: boolean;
  projectPolicyAllowsFallback: boolean;
}): boolean {
  return input.fallbackPolicy.secondaryModelIds.concat(input.fallbackPolicy.optionalThirdModelIds).includes(input.candidateModel.id) &&
    input.fallbackPolicy.allowedDataClassifications.includes(input.dataClassification) &&
    input.fallbackPolicy.allowedLanguages.includes(input.language) &&
    input.fallbackPolicy.allowedModalities.includes(input.modality) &&
    input.candidateModel.supportedLanguages.includes(input.language) &&
    input.candidateModel.modalities.includes(input.modality) &&
    input.rightsAllowTransfer &&
    input.projectPolicyAllowsFallback;
}

export function detectPromptInjection(content: string): AiPolicyValidationResult {
  const lower = content.toLowerCase();
  const suspiciousPatterns = [
    "ignore previous instructions",
    "ignore system instructions",
    "you are now",
    "developer message",
    "system prompt",
    "call tool",
    "grant permission",
    "bypass policy",
    "reveal secret"
  ];

  const issues = suspiciousPatterns
    .filter((pattern) => lower.includes(pattern))
    .map((pattern) => ({
      code: "PROMPT_INJECTION_PATTERN",
      message: `Retrieved content contains suspicious instruction-like text: ${pattern}.`,
      severity: "HIGH" as const
    }));

  return policyResult(issues);
}

export function evaluateCostGate(input: {
  currentSpend: number;
  projectedCost: number;
  budget: Pick<AIBudget, "softLimit" | "hardLimit" | "status">;
  approvedFallbackAvailable?: boolean;
}): AiCostGateDecision {
  const projected = input.currentSpend + input.projectedCost;

  if (input.budget.status === "SUSPENDED" || projected >= input.budget.hardLimit) {
    return input.approvedFallbackAvailable === true ? "REQUIRE_APPROVED_FALLBACK" : "BLOCK_HARD_LIMIT";
  }

  if (projected >= input.budget.softLimit) {
    return "WARN_SOFT_LIMIT";
  }

  return "ALLOW";
}

export function createSemanticCacheKey(input: {
  organizationId: string;
  agentVersion: string;
  promptVersion: string;
  modelVersion: string;
  sourceVersion: string;
  inputHash: string;
  policyContext: string;
}): string {
  return stableStringify(input);
}

export function evaluateExternalAiDataPolicy(input: {
  classification: AiDataClassification;
  providerId: string;
  policies: AIDataPolicy[];
}): AiDataProtectionAction {
  const policy = input.policies.find((candidate) =>
    candidate.classification === input.classification && candidate.status === "ACTIVE"
  );

  if (!policy) {
    return "BLOCK_EXTERNAL_AI";
  }

  if (!policy.allowedProviderIds.includes(input.providerId) && policy.externalProviderAction === "ALLOW") {
    return "BLOCK_EXTERNAL_AI";
  }

  return policy.externalProviderAction;
}

export function isDisabledByKillSwitch(
  targetType: AiKillSwitchTargetType,
  targetId: string,
  killSwitches: Pick<KillSwitch, "disabled" | "targetId" | "targetType">[]
): boolean {
  return killSwitches.some((killSwitch) =>
    killSwitch.disabled && killSwitch.targetType === targetType && killSwitch.targetId === targetId
  );
}

export function assessDataPoisoning(input: {
  sourceId: string;
  verifiedProvenance: boolean;
  duplicate: boolean;
  compromised: boolean;
  coherentMetadata: boolean;
  promptInjectionDetected: boolean;
}): DataPoisoningAssessment {
  const issues: AiValidationIssue[] = [];

  addBlockingUnless(input.verifiedProvenance, "SOURCE_PROVENANCE_MISSING", "Source provenance must be verified.", issues);

  if (input.duplicate) {
    issues.push({ code: "DUPLICATE_SOURCE", message: "Duplicate source requires review.", severity: "MEDIUM" });
  }

  if (input.compromised) {
    issues.push({ code: "COMPROMISED_SOURCE", message: "Compromised source must be quarantined.", severity: "CRITICAL" });
  }

  addBlockingUnless(input.coherentMetadata, "INCOHERENT_METADATA", "Source metadata must be coherent.", issues);

  if (input.promptInjectionDetected) {
    issues.push({ code: "EMBEDDED_INSTRUCTION_ATTACK", message: "Source contains embedded instruction attack.", severity: "HIGH" });
  }

  return {
    sourceId: input.sourceId,
    status: issues.some((issue) => issue.severity === "CRITICAL") ? "REJECT" : issues.length > 0 ? "QUARANTINE" : "ALLOW",
    issues
  };
}

export function classifyLegacyAiAsset(input: {
  canonical?: boolean;
  hasVersionedPrompt?: boolean;
  hasProviderRegistryEntry?: boolean;
  hasControlledRag?: boolean;
  hasCostTracking?: boolean;
  rightsKnown?: boolean;
  orphaned?: boolean;
}): LegacyAiClassification {
  if (input.canonical === true) {
    return "CANONICAL";
  }

  if (input.orphaned === true) {
    return "ORPHANED";
  }

  if (input.hasVersionedPrompt !== true) {
    return "UNVERSIONED_PROMPT";
  }

  if (input.hasProviderRegistryEntry !== true) {
    return "DIRECT_PROVIDER_CALL";
  }

  if (input.hasControlledRag !== true) {
    return "UNCONTROLLED_RAG";
  }

  if (input.hasCostTracking !== true) {
    return "UNTRACKED_COST";
  }

  if (input.rightsKnown !== true) {
    return "RIGHTS_UNKNOWN";
  }

  return "LEGACY_AI";
}

export const TERMINOLOGY_RAG_PRIORITY = [
  "Project terminology",
  "Validated specialized glossary",
  "General editorial glossary",
  "Approved external references"
] as const;

export const CODEX_KNOWLEDGE_COLLECTION_NAME = "CODEX_KNOWLEDGE" as const;

function addBlockingUnless(
  condition: boolean,
  code: string,
  message: string,
  issues: AiValidationIssue[]
): void {
  if (!condition) {
    issues.push({ code, message, severity: "HIGH" });
  }
}

function policyResult(issues: AiValidationIssue[]): AiPolicyValidationResult {
  return {
    allowed: issues.length === 0,
    issues
  };
}

function totalUnitCost(model: AIModelDefinition): number {
  return model.costProfile.inputUnitCost + model.costProfile.outputUnitCost;
}

function qualityScore(model: AIModelDefinition, requiredQuality: number): number {
  return model.capabilities.length + riskRank(model.riskProfile) + requiredQuality;
}

function riskRank(risk: AiRiskLevel): number {
  switch (risk) {
    case "LOW":
      return 1;
    case "MEDIUM":
      return 2;
    case "HIGH":
      return 3;
    case "CRITICAL":
      return 4;
  }
}

function stableStringify(value: unknown): string {
  if (value === null || typeof value !== "object") {
    return JSON.stringify(value);
  }

  if (Array.isArray(value)) {
    return `[${value.map((item) => stableStringify(item)).join(",")}]`;
  }

  const record = value as Record<string, unknown>;
  const keys = Object.keys(record).sort();

  return `{${keys.map((key) => `${JSON.stringify(key)}:${stableStringify(record[key])}`).join(",")}}`;
}
