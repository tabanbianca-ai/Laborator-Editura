import type { StatusSignal } from "./right-panel-container";

export type SegmentStatus = "Draft" | "In QA" | "In Review" | "Approved";

export interface EditorSegment {
  fidelityScore: number;
  id: string;
  number: number;
  source: string;
  status: SegmentStatus;
  target: string;
  terminologyScore: number;
}

export const activeSegment: EditorSegment = {
  fidelityScore: 96,
  id: "seg-001",
  number: 1,
  source: "El espíritu sobrevive a la muerte del cuerpo.",
  status: "In Review",
  target: "Spiritul supraviețuiește morții corpului.",
  terminologyScore: 98
};

export const editorSegments: EditorSegment[] = [
  activeSegment,
  {
    fidelityScore: 89,
    id: "seg-002",
    number: 2,
    source: "La conciencia conserva su individualidad después de la transición.",
    status: "In QA",
    target: "Conștiința își păstrează individualitatea după tranziție.",
    terminologyScore: 92
  },
  {
    fidelityScore: 84,
    id: "seg-003",
    number: 3,
    source: "Cada prueba moral debe analizarse dentro de su contexto espiritual.",
    status: "Draft",
    target: "Fiecare încercare morală trebuie analizată în contextul ei spiritual.",
    terminologyScore: 88
  },
  {
    fidelityScore: 97,
    id: "seg-004",
    number: 4,
    source: "La caridad no sustituye la responsabilidad, sino que la ilumina.",
    status: "Approved",
    target: "Caritatea nu înlocuiește responsabilitatea, ci o luminează.",
    terminologyScore: 96
  }
];

export const editorSuggestions = [
  "Validated term: espíritu -> spirit",
  "TM match available with 96% confidence",
  "QA status: no blocking issues"
];

export const editorTmSuggestions = [
  {
    confidence: 96,
    source: "El espíritu sobrevive a la muerte del cuerpo.",
    status: "APPROVED",
    target: "Spiritul supraviețuiește morții corpului."
  },
  {
    confidence: 88,
    source: "El alma continúa después de la muerte física.",
    status: "REFERENCE",
    target: "Sufletul continuă după moartea fizică."
  }
];

export const editorTerminologyMatches = [
  {
    forbidden: ["suflet nemuritor"],
    source: "espíritu",
    status: "VALIDATED",
    target: "spirit"
  },
  {
    forbidden: ["schimbare totală"],
    source: "transición",
    status: "UNDER_REVIEW",
    target: "tranziție"
  }
];

export const editorQaIssues = [
  {
    check: "Terminology violation",
    message: "Forbidden variant detected in target text.",
    severity: "HIGH",
    status: "OPEN"
  },
  {
    check: "Number mismatch",
    message: "Source and target numeric values require review.",
    severity: "CRITICAL",
    status: "OPEN"
  }
];

export const editorSemanticIssues = [
  {
    alternative: "Preserve 'spirit' as the validated terminology choice.",
    explanation: "The current wording risks introducing a doctrinal reinterpretation.",
    issueType: "unjustified reinterpretation",
    risk: "HIGH"
  },
  {
    alternative: "Keep the source context attached to the segment.",
    explanation: "The target narrows the contextual scope of the source sentence.",
    issueType: "context mismatch",
    risk: "MEDIUM"
  }
];

export const editorWorkflowSignals: StatusSignal[] = [
  {
    label: "Current status",
    status: "IN_REVIEW",
    tone: "warning"
  },
  {
    label: "Approval authority",
    status: "Reviewer required",
    tone: "info"
  },
  {
    label: "Blocked by QA",
    status: "Yes",
    tone: "danger"
  }
];

export const editorExportReadiness: StatusSignal[] = [
  {
    label: "JSON Master",
    status: "Ready",
    tone: "success"
  },
  {
    label: "PDF",
    status: "Blocked",
    tone: "warning"
  },
  {
    label: "DOCX",
    status: "Waiting approval",
    tone: "info"
  }
];
