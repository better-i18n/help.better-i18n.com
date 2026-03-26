/**
 * Mobile navigation drawer with collection links and language switcher.
 */

import { Link, useRouterState } from "@tanstack/react-router";
import { useT } from "@/lib/i18n";
import { LanguageSwitcher } from "@/components/shared/language-switcher";
import { DynamicIcon } from "@/components/shared/dynamic-icon";
import type { HelpCollection } from "@/lib/content";

interface MobileNavProps {
  locale: string;
  collections: HelpCollection[];
  open: boolean;
  onClose: () => void;
}

export function MobileNav({ locale, collections, open, onClose }: MobileNavProps) {
  const t = useT("common");
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 cursor-pointer bg-black/20 backdrop-blur-sm lg:hidden"
        onClick={onClose}
        onKeyDown={(e) => e.key === "Escape" && onClose()}
        role="button"
        tabIndex={0}
        aria-label={t("mobileNav.close", { defaultValue: "Close navigation" })}
      />

      {/* Drawer */}
      <div
        className="fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-[var(--color-card)] shadow-xl lg:hidden"
        role="dialog"
        aria-modal="true"
        aria-label={t("mobileNav.title", { defaultValue: "Navigation" })}
      >
        {/* Header */}
        <div className="flex h-14 shrink-0 items-center justify-between border-b border-mist-200 px-4">
          <Link
            to="/$locale/"
            params={{ locale }}
            onClick={onClose}
            className="font-semibold text-mist-950 transition-colors hover:text-mist-700"
          >
            {t("mobileNav.title", { defaultValue: "Help Center" })}
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-lg p-1.5 text-mist-500 transition-colors hover:bg-mist-100 hover:text-mist-900"
            aria-label={t("mobileNav.close", { defaultValue: "Close navigation" })}
          >
            <svg
              className="size-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Collections */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          {collections.length > 0 && (
            <>
              <p className="mb-2 px-3 text-xs font-medium uppercase tracking-wider text-mist-400">
                {t("sidebar.collectionsHeading", { defaultValue: "Collections" })}
              </p>
              <ul className="space-y-0.5">
                {collections.map((collection) => {
                  const href = `/${locale}/${collection.slug}/`;
                  const isActive = currentPath.startsWith(href);

                  return (
                    <li key={collection.slug}>
                      <Link
                        to="/$locale/$collection/"
                        params={{ locale, collection: collection.slug }}
                        onClick={onClose}
                        className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors ${
                          isActive
                            ? "bg-mist-100 font-medium text-mist-950"
                            : "text-mist-600 hover:bg-mist-50 hover:text-mist-900"
                        }`}
                      >
                        <DynamicIcon name={collection.icon} className="size-4 shrink-0" />
                        <span className="flex-1 truncate">{collection.title}</span>
                        {collection.articleCount > 0 && (
                          <span className="text-xs text-mist-400">{collection.articleCount}</span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </>
          )}

          {collections.length === 0 && (
            <Link
              to="/$locale/"
              params={{ locale }}
              onClick={onClose}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-mist-600 transition-colors hover:bg-mist-50 hover:text-mist-900"
            >
              {t("mobileNav.allTopics", { defaultValue: "All Topics" })}
            </Link>
          )}
        </nav>

        {/* Footer: language switcher */}
        <div className="shrink-0 border-t border-mist-200 px-3 py-3">
          <LanguageSwitcher />
        </div>
      </div>
    </>
  );
}
