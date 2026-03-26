import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useT } from "@/lib/i18n";
import { LANDING_URL, SIGNUP_URL, SITE_NAME, LOGO_URL } from "@/lib/config";
import { LanguageSwitcher } from "@/components/shared/language-switcher";
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
      <header className="sticky top-0 z-10 h-14 border-b border-mist-200 bg-[var(--color-background)]/80 backdrop-blur-lg">
        <div className="mx-auto flex h-full max-w-7xl items-center gap-4 px-6">
          {/* Hamburger button — mobile only */}
          <button
            type="button"
            onClick={() => setMobileNavOpen(true)}
            className="cursor-pointer rounded-lg p-1.5 text-mist-500 transition-colors hover:bg-mist-100 hover:text-mist-900 lg:hidden"
            aria-label={t("mobileNav.open", { defaultValue: "Open navigation" })}
          >
            <svg
              className="size-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Logo — "Better I18N / Help" breadcrumb style */}
          <div className="flex items-center gap-2.5">
            {LANDING_URL ? (
              <a
                href={LANDING_URL}
                className="flex items-center gap-2 font-semibold text-mist-950 transition-colors hover:text-mist-700"
              >
                <img
                  src={LOGO_URL || "/logo.svg"}
                  alt={SITE_NAME}
                  width={24}
                  height={24}
                  className="shrink-0 dark:invert"
                />
                <span className="hidden sm:inline">{SITE_NAME}</span>
              </a>
            ) : (
              <span className="flex items-center gap-2 font-semibold text-mist-950">
                <img
                  src={LOGO_URL || "/logo.svg"}
                  alt={SITE_NAME}
                  width={24}
                  height={24}
                  className="shrink-0 dark:invert"
                />
                <span className="hidden sm:inline">{SITE_NAME}</span>
              </span>
            )}
            <span className="text-mist-300">/</span>
            <Link
              to="/$locale/"
              params={{ locale }}
              className="text-sm text-mist-500 transition-colors hover:text-mist-950"
            >
              {t("header.title")}
            </Link>
          </div>

          {/* Right side */}
          <nav className="ml-auto flex items-center gap-3">
            <div className="hidden lg:block">
              <LanguageSwitcher />
            </div>
            {SIGNUP_URL && (
              <a
                href={SIGNUP_URL}
                className="rounded-full bg-[var(--color-foreground)] px-4 py-1.5 text-sm font-medium text-[var(--color-background)] transition-colors hover:opacity-80"
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
