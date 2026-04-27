import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useT } from "@/lib/i18n";
import { LANDING_URL, SIGNUP_URL, SITE_NAME, LOGO_URL } from "@/lib/config";
import { LanguageSwitcher } from "@/components/shared/language-switcher";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { MobileNav } from "@/components/layout/mobile-nav";
import type { HelpCollection } from "@/lib/content";

interface HelpHeaderProps {
  locale: string;
  collections?: HelpCollection[];
}

export function HelpHeader({ locale, collections = [] }: HelpHeaderProps) {
  const t = useT("common");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <>
      <header className="bg-mist-50">
        <div className="mx-auto flex h-14 max-w-5xl items-center gap-4 px-6 md:px-8">
          {/* Hamburger — mobile only */}
          <button
            type="button"
            onClick={() => setMobileNavOpen(true)}
            className="cursor-pointer rounded-lg p-1.5 text-mist-400 transition-colors hover:text-mist-900 lg:hidden"
            aria-label={t("mobileNav.open", { defaultValue: "Open navigation" })}
          >
            <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Logo */}
          <a href={LANDING_URL || "/"} className="flex items-center gap-2 md:gap-2.5">
            <img
              src={LOGO_URL || "/logo.svg"}
              alt={SITE_NAME}
              width={20}
              height={20}
              className="size-4 shrink-0 rounded md:size-5 dark:invert"
            />
            <span className="text-sm font-medium text-mist-950 md:text-base">{SITE_NAME}</span>
          </a>

          <span className="text-mist-300">/</span>
          <Link
            to="/$locale/"
            params={{ locale }}
            className="text-sm text-mist-400 transition-colors hover:text-mist-950"
          >
            {t("header.title")}
          </Link>

          {/* Right side */}
          <nav className="ml-auto flex items-center gap-2">
            <ThemeToggle />
            <div className="hidden sm:block">
              <LanguageSwitcher />
            </div>
            {SIGNUP_URL && (
              <a
                href={SIGNUP_URL}
                className="rounded-full bg-mist-950 px-4 py-1.5 text-sm font-medium text-mist-50 transition-colors hover:bg-mist-800"
              >
                {t("header.cta")}
              </a>
            )}
          </nav>
        </div>
      </header>

      <MobileNav
        locale={locale}
        collections={collections}
        open={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
      />
    </>
  );
}
