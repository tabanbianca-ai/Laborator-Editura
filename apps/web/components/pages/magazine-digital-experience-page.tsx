import type { ComponentProps } from "react";
import Link from "next/link";

import type {
  MagazineArticleExperience,
  MagazineExperienceIndexData,
  MagazineIssueExperienceData,
  MagazineIssueSummary,
  MagazinePublicationStatus,
  MagazineReadinessStatus
} from "../../lib/magazine-experience-client";
import { Badge, Card, EmptyState, ErrorState, PageHeader, Table } from "../ui";

type BadgeTone = ComponentProps<typeof Badge>["tone"];

export function MagazineDigitalExperienceIndexPage({
  data
}: {
  data: MagazineExperienceIndexData;
}) {
  return (
    <main className="page-stack">
      <PageHeader
        eyebrow="Magazine"
        title="Magazine digital experience"
      />

      {data.projectsError ? <ErrorState message={data.projectsError} title="Projects unavailable" /> : null}
      {data.documentsError ? <ErrorState message={data.documentsError} title="Documents unavailable" /> : null}

      <MagazineOverview issues={data.issues} />

      <section className="content-panel">
        <div className="section-heading">
          <div>
            <p className="section-kicker">Issues</p>
            <h2>Digital magazine issues</h2>
          </div>
          <Badge tone="info">{data.issues.length} issues</Badge>
        </div>

        {data.issues.length === 0 ? (
          <EmptyState
            description="Create or import magazine article documents to prepare a digital issue."
            title="No magazine issues available"
          />
        ) : (
          <div className="pipeline-project-list">
            {data.issues.map((issue) => (
              <MagazineIssueLink issue={issue} key={issue.id} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export function MagazineDigitalExperienceIssuePage({
  data
}: {
  data: MagazineIssueExperienceData;
}) {
  if (!data.issue) {
    return (
      <main className="page-stack">
        <PageHeader
          actions={
            <Link className="ui-button ui-button-secondary ui-button-md" href="/magazine">
              All magazine issues
            </Link>
          }
          eyebrow="Magazine"
          title="Issue not found"
        />
        {data.projectsError ? <ErrorState message={data.projectsError} title="Projects unavailable" /> : null}
        {data.documentsError ? <ErrorState message={data.documentsError} title="Documents unavailable" /> : null}
        <EmptyState title="No magazine issue found for this route" />
      </main>
    );
  }

  return (
    <main className="page-stack">
      <PageHeader
        actions={
          <Link className="ui-button ui-button-secondary ui-button-md" href="/magazine">
            All magazine issues
          </Link>
        }
        eyebrow="Magazine"
        title={data.issue.title}
      />

      {data.projectsError ? <ErrorState message={data.projectsError} title="Projects unavailable" /> : null}
      {data.documentsError ? <ErrorState message={data.documentsError} title="Documents unavailable" /> : null}

      <MagazineOverview issues={[data.issue]} />

      {data.issue.rightsWarnings.length > 0 ? (
        <section className="rights-warning-banner" aria-label="Magazine rights warnings">
          <strong>Translation or publication cannot continue until the required rights are available.</strong>
          <ul>
            {data.issue.rightsWarnings.map((warning, index) => (
              <li key={`${warning.code}-${index}`}>{warning.message}</li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="publishing-workspace-grid" aria-label="Magazine issue digital readiness">
        <IssueOverviewPanel issue={data.issue} />
        <FlipbookPanel issue={data.issue} />
        <PublicPortalPanel issue={data.issue} />
      </section>

      <section className="content-panel">
        <div className="section-heading">
          <div>
            <p className="section-kicker">Articles</p>
            <h2>Issue article list</h2>
          </div>
          <Badge tone="info">{data.issue.articles.length} articles</Badge>
        </div>
        <ArticleTable articles={data.issue.articles} />
      </section>

      <section className="publishing-workspace-grid publishing-workspace-grid-wide" aria-label="Article media readiness">
        <ArticleMediaPanel articles={data.issue.articles} mediaType="audio" />
        <ArticleMediaPanel articles={data.issue.articles} mediaType="video" />
      </section>
    </main>
  );
}

function MagazineOverview({ issues }: { issues: MagazineIssueSummary[] }) {
  const readyFlipbooks = issues.filter((issue) => issue.flipbookStatus !== "NOT_READY").length;
  const visibleIssues = issues.filter((issue) => issue.publicPortalVisibility === "VISIBLE").length;
  const rightsWarnings = issues.reduce((total, issue) => total + issue.rightsWarningCount, 0);

  return (
    <section className="metric-grid" aria-label="Magazine digital overview">
      <Card>
        <div className="metric-card">
          <span>Issues</span>
          <strong>{issues.length}</strong>
          <Badge tone="info">Magazine</Badge>
        </div>
      </Card>
      <Card>
        <div className="metric-card">
          <span>Articles</span>
          <strong>{issues.reduce((total, issue) => total + issue.articleCount, 0)}</strong>
          <Badge tone="neutral">Linked content</Badge>
        </div>
      </Card>
      <Card>
        <div className="metric-card">
          <span>Flipbook readiness</span>
          <strong>{readyFlipbooks}</strong>
          <Badge tone={readyFlipbooks > 0 ? "success" : "neutral"}>PDF based</Badge>
        </div>
      </Card>
      <Card>
        <div className="metric-card">
          <span>Public visibility</span>
          <strong>{visibleIssues}</strong>
          <Badge tone={visibleIssues > 0 ? "success" : "warning"}>Portal</Badge>
        </div>
      </Card>
      <Card>
        <div className="metric-card">
          <span>Rights warnings</span>
          <strong>{rightsWarnings}</strong>
          <Badge tone={rightsWarnings > 0 ? "warning" : "success"}>Provenance</Badge>
        </div>
      </Card>
    </section>
  );
}

function MagazineIssueLink({ issue }: { issue: MagazineIssueSummary }) {
  return (
    <Link className="pipeline-project-card" href={issue.href}>
      <div>
        <strong>{issue.title}</strong>
        <span>{issue.languageLabel} · {issue.articleCount} articles</span>
      </div>
      <div className="pipeline-project-meta">
        <Badge tone={toneForPublication(issue.publicationStatus)}>
          {issue.publicationStatus.replace(/_/g, " ")}
        </Badge>
        <Badge tone={toneForReadiness(issue.flipbookStatus)}>
          Flipbook {issue.flipbookStatus.replace(/_/g, " ")}
        </Badge>
        <Badge tone={issue.rightsWarningCount > 0 ? "warning" : "success"}>
          {issue.rightsWarningCount} rights warnings
        </Badge>
      </div>
    </Link>
  );
}

function IssueOverviewPanel({ issue }: { issue: MagazineIssueSummary }) {
  return (
    <Card title="Magazine issue overview">
      <div className="reference-stack">
        <ReferenceItem label="Publication status" value={issue.publicationStatus.replace(/_/g, " ")} />
        <ReferenceItem label="PDF export status" value={issue.pdfExportStatus.replace(/_/g, " ")} />
        <ReferenceItem label="Flipbook status" value={issue.flipbookStatus.replace(/_/g, " ")} />
        <ReferenceItem label="Public portal visibility" value={issue.publicPortalVisibility.replace(/_/g, " ")} />
        <ReferenceItem label="Language" value={issue.languageLabel} />
        <ReferenceItem label="Rights warnings" value={String(issue.rightsWarningCount)} />
      </div>
    </Card>
  );
}

function FlipbookPanel({ issue }: { issue: MagazineIssueSummary }) {
  return (
    <Card title="Flipbook">
      <div className="reference-stack">
        <ReferenceItem label="Readiness" value={issue.flipbookStatus.replace(/_/g, " ")} />
        <ReferenceItem label="Source" value="Uses PDF/exported layout" />
        <ReferenceItem label="Provider" value="No external flipbook provider configured" />
        <button className="ui-button ui-button-secondary ui-button-sm" disabled type="button">
          Generate Flipbook
        </button>
        <p className="pipeline-guidance">
          Flipbook status is a readiness placeholder. It does not publish or approve the issue.
        </p>
      </div>
    </Card>
  );
}

function PublicPortalPanel({ issue }: { issue: MagazineIssueSummary }) {
  return (
    <Card title="Public portal visibility">
      <div className="reference-stack">
        <ReferenceItem label="Visibility" value={issue.publicPortalVisibility.replace(/_/g, " ")} />
        <ReferenceItem label="Portal rule" value="Publication remains gated by authorized human approval" />
        <ReferenceItem label="Draft content" value="Never public" />
      </div>
    </Card>
  );
}

function ArticleTable({ articles }: { articles: MagazineArticleExperience[] }) {
  if (articles.length === 0) {
    return <EmptyState title="No articles in this magazine issue" />;
  }

  return (
    <Table ariaLabel="Magazine issue articles">
      <thead>
        <tr>
          <th>Article</th>
          <th>Type</th>
          <th>Language</th>
          <th>Status</th>
          <th>Rights</th>
          <th>Audio</th>
          <th>Video</th>
        </tr>
      </thead>
      <tbody>
        {articles.map((article) => (
          <tr key={article.documentId}>
            <td>{article.title}</td>
            <td>{article.documentType}</td>
            <td>{article.languageLabel}</td>
            <td>
              <Badge tone={toneForPublication(article.publicationStatus)}>
                {article.publicationStatus.replace(/_/g, " ")}
              </Badge>
            </td>
            <td>
              <Badge tone={article.rightsWarnings.length > 0 ? "warning" : "success"}>
                {article.rightsWarnings.length > 0 ? "Warnings" : "Clear"}
              </Badge>
            </td>
            <td>{article.audio.officialStatus.replace(/_/g, " ")}</td>
            <td>{article.video.officialStatus.replace(/_/g, " ")}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

function ArticleMediaPanel({
  articles,
  mediaType
}: {
  articles: MagazineArticleExperience[];
  mediaType: "audio" | "video";
}) {
  const title = mediaType === "audio" ? "Audio Article" : "Video Article";

  return (
    <Card title={title}>
      {articles.length === 0 ? (
        <EmptyState title={`No ${title.toLowerCase()} readiness metadata`} />
      ) : (
        <div className="reference-stack">
          {articles.map((article) => (
            <article className="pipeline-warning" key={`${mediaType}-${article.documentId}`}>
              <Badge tone={toneForReadiness(mediaType === "audio" ? article.audio.officialStatus : article.video.officialStatus)}>
                {mediaType === "audio" ? article.audio.officialStatus : article.video.officialStatus}
              </Badge>
              <div>
                <strong>{article.title}</strong>
                {mediaType === "audio" ? (
                  <>
                    <span>Voice: {article.audio.voice}</span>
                    <span>Narrator: {article.audio.narrator}</span>
                    <span>Language/locale: {article.audio.languageLocale}</span>
                    <span>Preview audio is available for article drafts and is never published.</span>
                  </>
                ) : (
                  <>
                    <span>Format: {article.video.exportFormat}</span>
                    <span>Voice-over: {article.video.voiceOverSource}</span>
                    <span>Subtitles: {article.video.subtitleLanguageLocale}</span>
                    <span>Thumbnail: {article.video.thumbnailMetadata}</span>
                    <span>Preview video is available for article drafts and is never published.</span>
                  </>
                )}
                {(mediaType === "audio" ? article.audio.officialLockedReason : article.video.officialLockedReason) ? (
                  <span>{mediaType === "audio" ? article.audio.officialLockedReason : article.video.officialLockedReason}</span>
                ) : null}
              </div>
            </article>
          ))}
          <div className="pipeline-step-actions">
            <button className="ui-button ui-button-secondary ui-button-sm" disabled type="button">
              {mediaType === "audio" ? "Generate Preview Audio" : "Generate Preview Video"}
            </button>
            <button className="ui-button ui-button-primary ui-button-sm" disabled type="button">
              {mediaType === "audio" ? "Generate Official Audio" : "Generate Official Video"}
            </button>
          </div>
          <p className="pipeline-guidance">
            Official {mediaType} is available only after article approval and publishing rights. AI may suggest media timing but cannot approve or publish.
          </p>
        </div>
      )}
    </Card>
  );
}

function ReferenceItem({
  label,
  value
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="reference-item">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function toneForPublication(status: MagazinePublicationStatus): BadgeTone {
  if (status === "PUBLISHED" || status === "READY") {
    return "success";
  }

  if (status === "NEEDS_RIGHTS") {
    return "warning";
  }

  return "neutral";
}

function toneForReadiness(status: MagazineReadinessStatus): BadgeTone {
  if (status === "PUBLISHED" || status === "READY") {
    return "success";
  }

  return "neutral";
}
