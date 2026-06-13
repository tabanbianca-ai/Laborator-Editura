import {
  Badge,
  EmptyState,
  ErrorState,
  Input,
  LoadingState,
  Table
} from "../ui";

type TranslationMemoryStatus = "APPROVED" | "PENDING" | "REJECTED";
type TranslationMemoryViewState = "ready" | "empty" | "loading" | "error";

interface TranslationMemoryEntry {
  approvalStatus: TranslationMemoryStatus;
  confidenceScore: number;
  domain: string;
  id: string;
  languagePair: string;
  sourceText: string;
  targetText: string;
}

const tmEntries: TranslationMemoryEntry[] = [
  {
    approvalStatus: "APPROVED",
    confidenceScore: 96,
    domain: "Spiritism",
    id: "tm-001",
    languagePair: "ES -> RO",
    sourceText: "El espíritu sobrevive a la muerte del cuerpo.",
    targetText: "Spiritul supraviețuiește morții corpului."
  },
  {
    approvalStatus: "APPROVED",
    confidenceScore: 91,
    domain: "Philosophy",
    id: "tm-002",
    languagePair: "FR -> RO",
    sourceText: "La conscience conserve son individualité.",
    targetText: "Conștiința își păstrează individualitatea."
  },
  {
    approvalStatus: "PENDING",
    confidenceScore: 84,
    domain: "Technical",
    id: "tm-003",
    languagePair: "EN -> RO",
    sourceText: "The source file contains structured segment metadata.",
    targetText: "Fișierul sursă conține metadate structurate ale segmentelor."
  }
];

function getTranslationMemoryViewState(): TranslationMemoryViewState {
  return "ready";
}

function getStatusTone(status: TranslationMemoryStatus) {
  if (status === "APPROVED") {
    return "success";
  }

  if (status === "PENDING") {
    return "warning";
  }

  return "danger";
}

export function TranslationMemoryPage() {
  const currentViewState = getTranslationMemoryViewState();

  return (
    <div className="page-stack">
      <section className="toolbar filter-toolbar">
        <Input
          aria-label="Search Translation Memory"
          name="tm-search"
          placeholder="Search source or target"
          type="search"
        />
        <Input
          aria-label="Filter by language pair"
          name="tm-language-pair"
          placeholder="Language pair"
        />
        <Input aria-label="Filter by domain" name="tm-domain" placeholder="Domain" />
      </section>

      <section className="content-panel">
        <div className="section-heading">
          <div>
            <p className="section-kicker">Translation Memory</p>
            <h2>TM entries</h2>
          </div>
          <Badge tone="info">{tmEntries.length} entries</Badge>
        </div>

        {currentViewState === "loading" ? (
          <LoadingState label="Loading TM entries" />
        ) : null}
        {currentViewState === "error" ? (
          <ErrorState message="Translation Memory entries could not be loaded." />
        ) : null}
        {currentViewState === "empty" ? <EmptyState title="No TM entries" /> : null}
        {currentViewState === "ready" ? (
          <Table ariaLabel="Translation Memory entries">
            <thead>
              <tr>
                <th>Source text</th>
                <th>Target text</th>
                <th>Language pair</th>
                <th>Domain</th>
                <th>Confidence</th>
                <th>Approval</th>
              </tr>
            </thead>
            <tbody>
              {tmEntries.map((entry) => (
                <tr key={entry.id}>
                  <td>{entry.sourceText}</td>
                  <td>{entry.targetText}</td>
                  <td>{entry.languagePair}</td>
                  <td>{entry.domain}</td>
                  <td>{entry.confidenceScore}%</td>
                  <td>
                    <Badge tone={getStatusTone(entry.approvalStatus)}>
                      {entry.approvalStatus}
                    </Badge>
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
