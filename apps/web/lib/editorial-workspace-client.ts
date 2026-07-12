import { getEditorialPipelineIndexData, type EditorialPipelineIndexProject } from "./editorial-pipeline-client";

export type EditorialWorkspacePublicationType =
  | "Book"
  | "Children's Book"
  | "Magazine"
  | "Poetry"
  | "Dictionary"
  | "Course"
  | "Audiobook"
  | "Video";

export interface EditorialWorkspaceAction {
  href: string;
  id: string;
  label: string;
  maxClicks: 1 | 2 | 3;
  summary: string;
}

export interface EditorialWorkspaceFormatGroup {
  formats: string[];
  id: string;
  title: string;
}

export interface EditorialWorkspaceTool {
  id: string;
  label: string;
  summary: string;
}

export interface EditorialWorkspacePanel {
  id: string;
  label: string;
  relevantFor: string[];
}

export interface EditorialWorkspaceData {
  actions: EditorialWorkspaceAction[];
  adaptationTargets: string[];
  collaborationFeatures: string[];
  formatGroups: EditorialWorkspaceFormatGroup[];
  panelBehavior: string[];
  panels: EditorialWorkspacePanel[];
  performanceTargets: string[];
  productionTools: EditorialWorkspaceTool[];
  projects: EditorialPipelineIndexProject[];
  projectsError: string | null;
  publicationTypes: EditorialWorkspacePublicationType[];
  reviewModes: string[];
}

export async function getEditorialWorkspaceData(): Promise<EditorialWorkspaceData> {
  const pipeline = await getEditorialPipelineIndexData();

  return {
    actions: EDITORIAL_WORKSPACE_ACTIONS,
    adaptationTargets: FORMAT_ADAPTATION_TARGETS,
    collaborationFeatures: COLLABORATION_FEATURES,
    formatGroups: FORMAT_GROUPS,
    panelBehavior: PANEL_BEHAVIOR,
    panels: WORKSPACE_PANELS,
    performanceTargets: PERFORMANCE_TARGETS,
    productionTools: PRODUCTION_TOOLS,
    projects: pipeline.projects,
    projectsError: pipeline.projectsError ?? pipeline.documentsError,
    publicationTypes: PUBLICATION_TYPES,
    reviewModes: REVIEW_MODES
  };
}

const PUBLICATION_TYPES: EditorialWorkspacePublicationType[] = [
  "Book",
  "Children's Book",
  "Magazine",
  "Poetry",
  "Dictionary",
  "Course",
  "Audiobook",
  "Video"
];

const EDITORIAL_WORKSPACE_ACTIONS: EditorialWorkspaceAction[] = [
  {
    href: "/projects/new",
    id: "import",
    label: "Import manuscript",
    maxClicks: 1,
    summary: "Start with Project Identity, Publication Type, capabilities, and dossiers."
  },
  {
    href: "/author-studio",
    id: "writing",
    label: "Write or edit",
    maxClicks: 1,
    summary: "Open manuscript sections, drafts, notes, and version metadata."
  },
  {
    href: "/translation",
    id: "translation",
    label: "Translate",
    maxClicks: 2,
    summary: "Open source and target text with terminology, lexicographic, and semantic support."
  },
  {
    href: "/review",
    id: "review",
    label: "Review",
    maxClicks: 2,
    summary: "Compare original and translation, inspect proposals, and accept or reject changes."
  },
  {
    href: "/publishing",
    id: "layout",
    label: "Layout and publishing",
    maxClicks: 2,
    summary: "Prepare layout, publication metadata, export history, and human approval visibility."
  },
  {
    href: "/distribution",
    id: "distribution",
    label: "Preflight and distribution",
    maxClicks: 2,
    summary: "Check technical validation, publication readiness, and distribution blockers."
  }
];

const PRODUCTION_TOOLS: EditorialWorkspaceTool[] = [
  { id: "drag-drop", label: "drag & drop", summary: "Move text, assets, and production blocks without exposing unrelated tools." },
  { id: "page-thumbnails", label: "page thumbnails", summary: "Navigate long books, magazines, and previews quickly." },
  { id: "paragraph-styles", label: "paragraph styles", summary: "Apply reusable paragraph-level editorial formatting." },
  { id: "character-styles", label: "character styles", summary: "Apply inline character styling consistently." },
  { id: "object-styles", label: "object styles", summary: "Keep images, captions, and objects visually consistent." },
  { id: "master-pages", label: "master pages/templates", summary: "Use templates without reproducing Adobe UI." },
  { id: "guides", label: "page guides", summary: "Show safe areas, margins, columns, and bleed." },
  { id: "rulers", label: "rulers", summary: "Support precise editorial placement." },
  { id: "grids", label: "grids", summary: "Align text, illustrations, covers, and magazine blocks." },
  { id: "snapping", label: "snapping", summary: "Snap objects to guides, grids, and margins." },
  { id: "alignment", label: "alignment", summary: "Align text frames, images, captions, and page objects." },
  { id: "page-numbering", label: "page numbering", summary: "Maintain publication-specific numbering after format changes." },
  { id: "headers", label: "headers", summary: "Manage running headers by template." },
  { id: "footers", label: "footers", summary: "Manage running footers by template." },
  { id: "toc", label: "table of contents", summary: "Keep TOC generated from manuscript structure." },
  { id: "footnotes", label: "footnotes", summary: "Preserve footnotes through layout and export." },
  { id: "endnotes", label: "endnotes", summary: "Preserve endnotes through layout and export." },
  { id: "hyperlinks", label: "hyperlinks", summary: "Track links for EPUB, PDF, HTML, and public portal output." },
  { id: "anchors", label: "anchors", summary: "Maintain internal references and article navigation." },
  { id: "image-placement", label: "image placement", summary: "Place illustrations and media assets in assigned sections." },
  { id: "image-fitting", label: "image fitting", summary: "Fit images to frames without manual reconstruction." },
  { id: "image-replacement", label: "image replacement", summary: "Replace images while preserving layout intent." },
  { id: "layers", label: "layers", summary: "Separate text, images, guides, and production metadata." },
  { id: "preflight", label: "preflight", summary: "Surface technical validation before distribution." },
  { id: "package-project", label: "package project", summary: "Collect outputs and metadata for handoff." },
  { id: "live-preview", label: "live preview", summary: "Preview publication output without publishing." }
];

const FORMAT_GROUPS: EditorialWorkspaceFormatGroup[] = [
  { id: "iso", title: "ISO", formats: ["A0", "A1", "A2", "A3", "A4", "A5", "A6", "A7"] },
  { id: "series-b", title: "Series B", formats: ["B4", "B5", "B6"] },
  { id: "series-c", title: "Series C", formats: ["C4", "C5", "C6"] },
  {
    id: "north-america",
    title: "North America",
    formats: ["Letter", "Legal", "Executive", "Ledger", "Tabloid", "Half Letter", "Junior Legal"]
  },
  {
    id: "trade-books",
    title: "Trade Book Formats",
    formats: ["Pocket", "Digest", "Crown", "Royal", "Demy", "Trade Paperback", "US Trade", "Mass Market Paperback"]
  },
  {
    id: "magazine",
    title: "Magazine formats",
    formats: ["A4", "A5", "Letter", "Square", "Landscape", "Brochure"]
  },
  {
    id: "children",
    title: "Children's books",
    formats: ["Board Book", "Picture Book", "Large Format", "Square"]
  },
  {
    id: "custom",
    title: "Custom",
    formats: [
      "width",
      "height",
      "portrait",
      "landscape",
      "bleed",
      "spine",
      "inside margin",
      "outside margin",
      "top margin",
      "bottom margin",
      "gutter",
      "safe area",
      "columns"
    ]
  }
];

const FORMAT_ADAPTATION_TARGETS = [
  "layout",
  "templates",
  "styles",
  "guides",
  "image placement",
  "page numbering",
  "export settings",
  "previews"
];

const REVIEW_MODES = [
  "2 columns",
  "3 columns",
  "4 columns",
  "sentence alignment",
  "paragraph alignment",
  "synchronized scrolling",
  "Accept/Reject",
  "immutable original"
];

const PANEL_BEHAVIOR = [
  "collapsible",
  "dockable",
  "resizable",
  "restorable",
  "favorites",
  "universal search",
  "configurable shortcuts",
  "recently used tools"
];

const WORKSPACE_PANELS: EditorialWorkspacePanel[] = [
  { id: "manuscript", label: "Manuscript", relevantFor: ["writing", "translation", "review"] },
  { id: "project-dossiers", label: "Project Dossiers", relevantFor: ["import", "assets"] },
  { id: "translation-review", label: "Translation & Review", relevantFor: ["translation", "review"] },
  { id: "layout-production", label: "Layout Production", relevantFor: ["layout", "publishing"] },
  { id: "illustrations", label: "Illustrations", relevantFor: ["illustration", "children", "magazine"] },
  { id: "preflight", label: "Preflight", relevantFor: ["technical validation", "distribution"] },
  { id: "collaboration", label: "Collaboration", relevantFor: ["comments", "mentions", "suggestions"] }
];

const COLLABORATION_FEATURES = [
  "Invite collaborator",
  "role assignment",
  "chapter assignment",
  "segment assignment",
  "live collaboration",
  "comments",
  "mentions",
  "suggestions",
  "accept/reject",
  "synchronized updates",
  "audit",
  "version history"
];

const PERFORMANCE_TARGETS = [
  "large books",
  "large magazines",
  "thousands of pages",
  "high-resolution illustrations",
  "multiple collaborators"
];
