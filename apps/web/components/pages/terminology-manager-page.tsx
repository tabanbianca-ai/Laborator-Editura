import {
  Badge,
  EmptyState,
  ErrorState,
  Input,
  LoadingState,
  Table
} from "../ui";

type TermStatus =
  | "PROPOSED"
  | "UNDER_REVIEW"
  | "VALIDATED"
  | "SUSPENDED"
  | "ARCHIVED";
type TerminologyViewState = "ready" | "empty" | "loading" | "error";

interface TerminologyTerm {
  definition: string;
  domain: string;
  forbiddenVariants: string[];
  id: string;
  language: string;
  notes: string;
  preferredVariants: string[];
  status: TermStatus;
  term: string;
  validatedTranslation: string;
}

const terms: TerminologyTerm[] = [
  {
    definition: "Principiu spiritual individual care supraviețuiește corpului.",
    domain: "Spiritism",
    forbiddenVariants: ["suflet nemuritor"],
    id: "term-001",
    language: "ES",
    notes: "Termen validat pentru corpusul spiritist.",
    preferredVariants: ["spirit"],
    status: "VALIDATED",
    term: "espíritu",
    validatedTranslation: "spirit"
  },
  {
    definition: "Proces de păstrare a identității după o schimbare de stare.",
    domain: "Philosophy",
    forbiddenVariants: ["transformare totală"],
    id: "term-002",
    language: "FR",
    notes: "Necesită verificare în contexte metafizice.",
    preferredVariants: ["individualitate"],
    status: "UNDER_REVIEW",
    term: "individualité",
    validatedTranslation: "individualitate"
  },
  {
    definition: "Formă de verificare a corespondenței sensului între segmente.",
    domain: "Technical",
    forbiddenVariants: ["rescriere liberă"],
    id: "term-003",
    language: "EN",
    notes: "Aplicabil în QA și semantic review.",
    preferredVariants: ["fidelitate semantică"],
    status: "PROPOSED",
    term: "semantic fidelity",
    validatedTranslation: "fidelitate semantică"
  },
  {
    definition: "Variantă istorică păstrată doar pentru audit terminologic.",
    domain: "Spiritism",
    forbiddenVariants: ["duh universal"],
    id: "term-004",
    language: "RO",
    notes: "Nu se utilizează în traducerile noi.",
    preferredVariants: ["spirit"],
    status: "ARCHIVED",
    term: "duh",
    validatedTranslation: "spirit"
  },
  {
    definition: "Variantă blocată până la decizie editorială.",
    domain: "Spirituality",
    forbiddenVariants: ["energie subtilă"],
    id: "term-005",
    language: "RO",
    notes: "Suspendat pentru risc de reinterpretare.",
    preferredVariants: ["forță spirituală"],
    status: "SUSPENDED",
    term: "energie",
    validatedTranslation: "forță spirituală"
  }
];

function getTerminologyViewState(): TerminologyViewState {
  return "ready";
}

function getTermStatusTone(status: TermStatus) {
  if (status === "VALIDATED") {
    return "success";
  }

  if (status === "UNDER_REVIEW" || status === "PROPOSED") {
    return "warning";
  }

  if (status === "SUSPENDED") {
    return "danger";
  }

  return "neutral";
}

export function TerminologyManagerPage() {
  const currentViewState = getTerminologyViewState();

  return (
    <div className="page-stack">
      <section className="toolbar filter-toolbar">
        <Input
          aria-label="Search terminology"
          name="term-search"
          placeholder="Search terms"
          type="search"
        />
        <Input
          aria-label="Filter terms by language"
          name="term-language"
          placeholder="Language"
        />
        <Input
          aria-label="Filter terms by status"
          name="term-status"
          placeholder="Status"
        />
      </section>

      <section className="content-panel">
        <div className="section-heading">
          <div>
            <p className="section-kicker">Terminology</p>
            <h2>Terminology manager</h2>
          </div>
          <Badge tone="info">{terms.length} terms</Badge>
        </div>

        {currentViewState === "loading" ? (
          <LoadingState label="Loading terminology" />
        ) : null}
        {currentViewState === "error" ? (
          <ErrorState message="Terminology entries could not be loaded." />
        ) : null}
        {currentViewState === "empty" ? <EmptyState title="No terms" /> : null}
        {currentViewState === "ready" ? (
          <Table ariaLabel="Terminology entries" className="terminology-table">
            <thead>
              <tr>
                <th>Term</th>
                <th>Language</th>
                <th>Domain</th>
                <th>Definition</th>
                <th>Validated translation</th>
                <th>Preferred variants</th>
                <th>Forbidden variants</th>
                <th>Notes</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {terms.map((term) => (
                <tr key={term.id}>
                  <td>{term.term}</td>
                  <td>{term.language}</td>
                  <td>{term.domain}</td>
                  <td>{term.definition}</td>
                  <td>{term.validatedTranslation}</td>
                  <td>{term.preferredVariants.join(", ")}</td>
                  <td>{term.forbiddenVariants.join(", ")}</td>
                  <td>{term.notes}</td>
                  <td>
                    <Badge tone={getTermStatusTone(term.status)}>{term.status}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : null}
      </section>
    </div>
  );
}
