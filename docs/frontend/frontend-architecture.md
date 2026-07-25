# Frontend Architecture

## Purpose

This document defines the target frontend architecture and compares it with
the current repository baseline.

It supports `docs/ARCHITECTURE_CHAPTER_11.md` and must be used before any
structural frontend redesign, design system change, routing change, PWA work,
or frontend/backend communication change.

## Target Architecture

Mandatory layering:

```text
Application Shell
  -> Routing Layer
  -> Layouts
  -> Pages
  -> Feature Components
  -> Shared Components
  -> Design System
```

Visual components must remain presentation-focused. Domain and integration
logic belongs in typed API clients, server actions, service boundaries, or
backend modules.

## Current Baseline

The current frontend foundation includes:

- Next.js App Router under `apps/web/app`.
- Shared AppShell under `apps/web/components/layout/app-shell.tsx`.
- Sidebar and top navigation components.
- UI primitives under `apps/web/components/ui`.
- Feature components for editor, projects, author studio, translation,
  review, publishing, distribution, research, library, rights, marketplace,
  administration, and pipeline surfaces.
- Central API helpers in `apps/web/lib/api-client.ts`.
- Module-specific clients in `apps/web/lib/*-client.ts`.
- Server actions in `apps/web/lib/*-actions.ts`.
- Partial UI internationalization in `apps/web/lib/ui-i18n.ts`.
- Design tokens in `apps/web/lib/design-tokens.ts`.
- Responsive CSS in `apps/web/app/globals.css`.
- Frontend contract tests under `apps/web/tests`.

## Dependency Map

| Layer | Current Files | Target Responsibility |
| --- | --- | --- |
| Application Shell | `components/layout/app-shell.tsx` | Authenticated layout, skip link, navigation, main content |
| Routing | `app/**/page.tsx`, `app/**/loading.tsx` | Route composition, loading boundaries |
| Layouts | AppShell, auth shell CSS, workspace pages | Reusable page structures |
| Feature components | `components/pages`, `components/editor`, `components/projects` | Domain-specific UI composition |
| Shared components | `components/ui` | Reusable primitives and composites |
| Design tokens | `lib/design-tokens.ts`, `globals.css` | Official visual foundation |
| API communication | `lib/api-client.ts`, module clients, server actions | Centralized backend communication |
| i18n | `lib/ui-i18n.ts` | Platform Language UI translation |

## Current Strengths

- AppShell already centralizes authenticated layout.
- Navigation comes from Workspace backend metadata and respects visibility.
- API calls are substantially centralized through reusable clients.
- Server-derived session tokens are used for backend calls.
- UI primitives exist for Button, Input, Badge, Card, Table, DataTable,
  EmptyState, LoadingState, ErrorState, Tabs, Modal shell, Select, and
  PageHeader.
- Responsive CSS includes desktop, tablet, and mobile breakpoints.
- Accessibility basics exist: skip link, semantic sections, ARIA labels,
  focus-visible styling, table wrappers, and tab roles.
- Platform Language i18n exists for key navigation, auth, dashboard,
  pipeline, distribution, roles, and language metadata.

## Current Gaps

- Some user-visible strings remain hardcoded in page, editor, loading, and
  feature components.
- PWA manifest, service worker, offline strategy, deferred sync, and push
  notification architecture are not yet implemented.
- Design tokens exist but global CSS still contains many literal visual values.
- Dark and system theme behavior is represented as metadata but not fully
  tokenized across all components.
- Large-list virtualization is not yet standardized.
- Frontend observability is not yet centralized.
- Accessibility is partially covered but not yet validated against WCAG 2.2 AA
  through automated and manual checks.

## Required Alignment

Future frontend work must converge toward:

- Complete Design System usage.
- Complete i18n externalization.
- Shared layout patterns.
- Central API clients for all backend communication.
- PWA readiness.
- WCAG 2.2 AA validation.
- Responsive behavior across desktop, laptop, tablet, and mobile.
- Performance budgets and frontend observability.
