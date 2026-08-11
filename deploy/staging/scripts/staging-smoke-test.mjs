#!/usr/bin/env node
import { loadStagingEnv, requiredEnv, stripTrailingSlash } from "./staging-env.mjs";
import { assertEqual, authHeaders, requestJson } from "./staging-http.mjs";

loadStagingEnv();

const apiBase = stripTrailingSlash(requiredEnv("API_BASE"));
const email = requiredEnv("STAGING_REVIEWER_EMAIL");
const displayName = requiredEnv("STAGING_REVIEWER_NAME");
const organizationName = requiredEnv("STAGING_ORGANIZATION_NAME");
const sourceText = "El espiritu conserva su identidad moral.";
const targetText = "Spiritul conserva identitatea morala.";
const domain = "spiritism";
const loginBody = {
  displayName,
  email,
  organizationName
};
const loginSecret = process.env.LABORATOR_AUTH_LOGIN_SECRET;

if (loginSecret) {
  loginBody.loginSecret = loginSecret;
}

const login = await requestJson(apiBase, "/auth/login", {
  body: loginBody,
  method: "POST"
});
const token = login.session.token;
const headers = authHeaders(token);

const health = await requestJson(apiBase, "/health");
assertEqual(health.status, "ok", "health status");

const me = await requestJson(apiBase, "/auth/me", { headers });
const spoofed = await requestJson(apiBase, "/auth/me", {
  headers: {
    ...headers,
    "x-organization-id": "spoofed-org",
    "x-user-id": "spoofed-user",
    "x-user-roles": "ADMIN"
  }
});
assertEqual(spoofed.userId, me.userId, "spoofed userId ignored");
assertEqual(spoofed.organizationId, me.organizationId, "spoofed organizationId ignored");

const project = await requestJson(apiBase, "/projects", {
  body: {
    domain,
    name: `Closed Beta Smoke Project ${Date.now()}`,
    projectIdentity: {
      projectOrigin: "ORIGINAL_CREATION",
      rightsStatus: "ORIGINAL_CREATION"
    },
    publicationType: "BOOK",
    sourceLanguage: "es",
    targetLanguages: ["ro"]
  },
  headers,
  method: "POST"
});

const document = await requestJson(apiBase, "/documents", {
  body: {
    documentType: "article",
    projectId: project.id,
    sourceLanguage: "es",
    targetLanguage: "ro",
    title: "Closed Beta Smoke Document"
  },
  headers,
  method: "POST"
});

const segment = await requestJson(apiBase, "/segments", {
  body: {
    documentId: document.id,
    order: 1,
    projectId: project.id,
    sourceLanguage: "es",
    sourceText,
    targetLanguage: "ro"
  },
  headers,
  method: "POST"
});

const term = await requestJson(apiBase, "/terminology/terms", {
  body: {
    approvedTranslation: "Spiritul",
    definition: "Validated smoke-test terminology.",
    domain,
    forbiddenVariants: ["Sufletul"],
    language: "ro",
    source: "GLOSSARY",
    status: "PROPOSED",
    term: "espiritu"
  },
  headers,
  method: "POST"
});
await requestJson(apiBase, `/terminology/terms/${term.id}/validate`, {
  headers,
  method: "POST"
});

const tmEntry = await requestJson(apiBase, "/translation-memory", {
  body: {
    approvalStatus: "PENDING",
    confidenceScore: 0.98,
    documentId: document.id,
    domain,
    origin: "HUMAN",
    projectId: project.id,
    sourceLanguage: "es",
    sourceSegmentId: segment.id,
    sourceText,
    targetLanguage: "ro",
    targetText
  },
  headers,
  method: "POST"
});
await requestJson(apiBase, `/translation-memory/${tmEntry.id}/approve`, {
  headers,
  method: "POST"
});

const tmMatches = await requestJson(
  apiBase,
  `/translation-memory/search?sourceText=${encodeURIComponent(sourceText)}&sourceLanguage=es&targetLanguage=ro&domain=${domain}&limit=1&similarityThreshold=0.75`,
  { headers }
);

if (!Array.isArray(tmMatches) || tmMatches.length === 0) {
  throw new Error("approved TM match was not returned");
}

await requestJson(apiBase, "/translations/submit", {
  body: {
    domain,
    segmentId: segment.id,
    targetText
  },
  headers,
  method: "POST"
});

const qaReport = await requestJson(apiBase, "/qa/segments/run", {
  body: {
    documentId: document.id,
    domain,
    projectId: project.id,
    segmentId: segment.id,
    sourceLanguage: "es",
    sourceText,
    targetLanguage: "ro",
    targetText
  },
  headers,
  method: "POST"
});

const semanticReport = await requestJson(apiBase, "/semantic-fidelity/segments/run", {
  body: {
    documentId: document.id,
    domain,
    projectId: project.id,
    segmentId: segment.id,
    sourceLanguage: "es",
    sourceText,
    targetLanguage: "ro",
    targetText
  },
  headers,
  method: "POST"
});

if (qaReport.issueCount !== 0) {
  throw new Error(`QA smoke report has ${qaReport.issueCount} issue(s)`);
}

if (semanticReport.issueCount !== 0) {
  throw new Error(`Semantic smoke report has ${semanticReport.issueCount} issue(s)`);
}

await requestJson(apiBase, "/workflow/start", {
  body: {
    documentId: document.id,
    projectId: project.id,
    scope: "DOCUMENT"
  },
  headers,
  method: "POST"
});

for (const toStatus of ["IN_TRANSLATION", "IN_QA", "IN_SEMANTIC_REVIEW", "IN_REVIEW"]) {
  await requestJson(apiBase, "/workflow/advance", {
    body: {
      documentId: document.id,
      projectId: project.id,
      toStatus
    },
    headers,
    method: "POST"
  });
}

await requestJson(apiBase, "/workflow/approve", {
  body: {
    documentId: document.id,
    projectId: project.id
  },
  headers,
  method: "POST"
});

await requestJson(apiBase, "/workflow/ready-for-export", {
  body: {
    documentId: document.id,
    projectId: project.id
  },
  headers,
  method: "POST"
});

const artifact = await requestJson(apiBase, `/export/documents/${document.id}/json-master`, {
  body: {
    projectId: project.id
  },
  headers,
  method: "POST"
});

if (!artifact.id || artifact.format !== "JSON_MASTER") {
  throw new Error("JSON Master export artifact was not generated");
}

console.log(JSON.stringify({
  status: "ok",
  action: "staging-smoke-test",
  projectId: project.id,
  documentId: document.id,
  segmentId: segment.id,
  exportArtifactId: artifact.id,
  spoofedHeadersIgnored: true
}, null, 2));
