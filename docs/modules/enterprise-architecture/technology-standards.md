# Enterprise Architecture Technology Standards

Technology Standards define approved languages, frameworks, databases,
messaging systems, AI engines, API standards, UI standards, security
standards, and code conventions.

## Current Technology Baseline

Current repository standards include:

- Internal implementation language: English.
- Primary frontend language: TypeScript.
- Primary backend language: TypeScript.
- Runtime: Node.js 22 in CI and staging expectations.
- Package manager: pnpm 10.12.1.
- Monorepo orchestration: Turbo.
- Backend framework: NestJS 11.
- Frontend framework: Next.js 15.
- UI library: React 19.
- Primary database standard: PostgreSQL documented in Chapter 6.
- Runtime local persistence package: `@laborator/db`.
- Shared contracts package: `@laborator/shared`.
- Containerization: Docker and Docker Compose for staging.
- Reverse proxy: Nginx for staging.
- Operations integration: systemd unit templates.
- CI/CD: GitHub Actions.
- Testing: Node test runner contract tests, TypeScript typecheck, lint,
  build, dependency audit, and vulnerability scanning.

## Standard Categories

Programming languages:

- TypeScript is approved and preferred for application code.
- JavaScript is approved for lightweight Node scripts and tests where already
  used.
- Shell scripts are approved for infrastructure automation when validated.

Frameworks:

- NestJS is approved for API services.
- Next.js is approved for Web.
- React is approved for UI components.

Databases:

- PostgreSQL is the primary relational database standard.
- Runtime file-backed persistence is an implementation bridge and should not
  become a duplicate architectural source of truth.

API standards:

- APIs must be typed.
- APIs must be authenticated unless explicitly public.
- Server-derived identity is mandatory.
- Versioned public API contracts are required for future enterprise APIs.

UI standards:

- UI text must use localization.
- No mixed-language UI.
- Reusable components are mandatory.
- Accessibility and responsive behavior are required.

Security standards:

- IAM and RBAC are central.
- Need-to-Know access is enforced server-side.
- Secrets must not be committed or logged.
- Human Final Authority applies to approvals.

AI standards:

- AI must use governed orchestration.
- AI providers, prompts, costs, and policies must be auditable.
- AI cannot approve, publish, grant rights, or bypass workflow.

## Standard Governance

New technology adoption requires:

- Business justification.
- Architecture review.
- Alternatives analysis.
- Risk assessment.
- Security review.
- Operational impact review.
- Approval.
- Migration plan when replacing an existing standard.

## Gaps

Technology standards are currently documented across multiple architecture
documents. They are not yet centralized as structured, versioned technology
standard records with lifecycle status and approval metadata.
