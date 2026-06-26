"use client";

import Link from "next/link";
import { formatLanguageLocale, PRODUCT_NAME } from "@laborator/shared";

import { Badge, Button } from "../ui";
import { createUiTranslator } from "../../lib/ui-i18n";
import type { WorkspaceNavigationItem, WorkspacePreferences } from "../../lib/workspace-types";
import { getCurrentNavigationLabel } from "./navigation";
import { toNavigationItems } from "./navigation";

interface TopNavProps {
  currentPath: string;
  navigation: WorkspaceNavigationItem[];
  preferences?: WorkspacePreferences | null;
}

export function TopNav({ currentPath, navigation, preferences }: TopNavProps) {
  const platformLanguage = preferences?.platformLanguage ?? preferences?.language ?? "en";
  const navigationItems = toNavigationItems(navigation, platformLanguage);
  const ui = createUiTranslator(platformLanguage);
  const language = formatLanguageLocale(platformLanguage);

  return (
    <header className="top-nav">
      <div>
        <p className="top-nav-kicker">{ui.t("nav.unifiedWorkspace")}</p>
        <h1>{getCurrentNavigationLabel(currentPath, navigationItems, platformLanguage)}</h1>
      </div>

      <div className="top-nav-meta" aria-label="Workspace status">
        <Link className="ui-button ui-button-primary ui-button-sm" href="/pipeline">
          {ui.t("label.productionPipeline")}
        </Link>
        <Link className="ui-button ui-button-secondary ui-button-sm" href="/distribution">
          {ui.t("label.distribution")}
        </Link>
        <Button disabled size="sm" variant="secondary">
          {ui.t("label.workspace")}
        </Button>
        <Button disabled size="sm" variant="ghost">
          {ui.t("label.user")}
        </Button>
        <Badge tone="neutral">{language}</Badge>
        <span>{PRODUCT_NAME}</span>
        <Badge tone="info">{ui.t("badge.closedBeta")}</Badge>
      </div>
    </header>
  );
}
