import type { ReactNode } from "react";
import { HelpHeader } from "./help-header";
import { HelpFooter } from "./help-footer";
import type { HelpCollection } from "@/lib/content";

interface HelpLayoutProps {
  locale: string;
  collections?: HelpCollection[];
  children: ReactNode;
}

export function HelpLayout({ locale, collections, children }: HelpLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <HelpHeader locale={locale} collections={collections} />
      <main className="flex-1">{children}</main>
      <HelpFooter locale={locale} />
    </div>
  );
}
