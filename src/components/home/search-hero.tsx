import { useT } from "@/lib/i18n";
import { SITE_NAME, LOGO_URL, LANDING_URL, SIGNUP_URL } from "@/lib/config";
import { LanguageSwitcher } from "@/components/shared/language-switcher";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { IconQuickSearch } from "@central-icons-react/round-outlined-radius-2-stroke-2";

interface SearchHeroProps {
  onSearchClick?: () => void;
}

export function SearchHero({ onSearchClick }: SearchHeroProps) {
  const t = useT("home");
  const tCommon = useT("common");

  return (
    <header className="bg-mist-50">
      <div className="mx-auto max-w-5xl space-y-10 px-6 pt-6 pb-8 md:space-y-12 md:px-8 md:pt-8 md:pb-10">
        {/* Nav bar */}
        <nav className="flex items-center justify-between gap-3">
          <a
            href={LANDING_URL || "/"}
            className="flex items-center gap-2 md:gap-2.5"
          >
            <img
              src={LOGO_URL || "/logo.svg"}
              alt={SITE_NAME}
              width={20}
              height={20}
              className="size-4 shrink-0 rounded md:size-5 dark:invert"
            />
            <span className="text-sm font-medium text-mist-950 md:text-base">
              {SITE_NAME}
            </span>
          </a>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <div className="hidden sm:block">
              <LanguageSwitcher />
            </div>
            {SIGNUP_URL && (
              <a
                href={SIGNUP_URL}
                className="rounded-full bg-mist-950 px-4 py-1.5 text-sm font-medium text-mist-50 transition-colors hover:bg-mist-800"
              >
                {tCommon("header.cta")}
              </a>
            )}
          </div>
        </nav>

        {/* Heading */}
        <h1 className="pt-6 text-2xl font-semibold tracking-tight text-mist-950 md:pt-10 md:text-3xl">
          {t("title")}
        </h1>

        {/* Search bar */}
        <div>
          <button
            type="button"
            onClick={onSearchClick}
            className="flex w-full cursor-pointer items-center gap-2 rounded-xl px-4 py-2.5 text-left backdrop-blur-2xl md:gap-2.5 md:rounded-2xl md:px-5 md:py-4"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.05)" }}
          >
            <IconQuickSearch className="size-5 shrink-0 opacity-40 md:size-6" />
            <span className="w-full text-base opacity-50 md:text-lg">
              {t("searchPlaceholder")}
            </span>
            <kbd className="pointer-events-none inline-flex h-6 shrink-0 items-center gap-0.5 rounded-sm bg-black/[0.075] px-2 text-xs font-medium text-mist-600 select-none backdrop-blur-md">
              &#8984; + K
            </kbd>
          </button>
        </div>
      </div>
    </header>
  );
}
