import type { Metadata } from "next";

import { AppShell } from "../components/layout/app-shell";
import {
  getWorkspaceNavigation,
  getWorkspacePreferences
} from "../lib/workspace-client";
import "./globals.css";

export const metadata: Metadata = {
  title: "Laboratorul Editurii",
  description: "Translation platform workspace"
};

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [navigationResult, preferencesResult] = await Promise.all([
    getWorkspaceNavigation(),
    getWorkspacePreferences()
  ]);
  const language = preferencesResult.data?.language ?? "ro";
  const theme = preferencesResult.data?.themeMetadata?.theme ?? "system";

  return (
    <html data-theme={theme} lang={language}>
      <body>
        <AppShell
          navigation={navigationResult.data ?? []}
          navigationError={navigationResult.error}
          preferences={preferencesResult.data}
        >
          {children}
        </AppShell>
      </body>
    </html>
  );
}
