import type { Metadata } from "next";

import { AppShell } from "../components/layout/app-shell";
import "./globals.css";

export const metadata: Metadata = {
  title: "Laboratorul Editurii",
  description: "Translation platform workspace"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ro">
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
