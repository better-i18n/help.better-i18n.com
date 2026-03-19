"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useLocation } from "@tanstack/react-router";
import { useLanguages } from "@better-i18n/use-intl";
import type { LanguageOption } from "@better-i18n/core";
import { getCachedLocales } from "@/lib/locales";

// ─── Inline helpers ──────────────────────────────────────────────────

function getLabel(lang: LanguageOption): string {
  return lang.nativeName || lang.name || lang.code.toUpperCase();
}

/** Read locale codes from SSR-injected script tag */
function readLocalesFromDOM(): string[] {
  if (typeof document === "undefined") return [];
  const el = document.getElementById("__i18n_locales__");
  if (!el?.textContent) return [];
  try {
    const parsed = JSON.parse(el.textContent);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/** Get locale codes — tries cached first, then DOM, then CDN languages */
function getAvailableLocales(richLanguages: LanguageOption[]): string[] {
  // 1. Module-level cache (populated by beforeLoad → fetchLocales())
  const cached = getCachedLocales();
  if (cached.length > 1) return cached;

  // 2. SSR-injected script tag
  const fromDOM = readLocalesFromDOM();
  if (fromDOM.length > 1) return fromDOM;

  // 3. CDN manifest (useLanguages)
  if (richLanguages.length > 0) return richLanguages.map((l) => l.code);

  return cached; // fallback to whatever we have
}

/**
 * URL-aware locale switcher for helpcenter.
 *
 * Unlike the SDK's LocaleDropdown, this component always keeps locale
 * prefixes in the URL (helpcenter uses $locale/ route structure where
 * ALL locales — including the default — have a URL prefix).
 *
 * Reads locale codes from multiple sources (cache → DOM → CDN) to
 * guarantee the dropdown works even if `useLanguages()` hasn't loaded.
 *
 * On locale change:
 * 1. URL navigates → server loader re-runs → fresh translations
 * 2. All components re-render with new locale
 */
export function LocaleSwitcher() {
  const router = useRouter();
  const location = useLocation();
  const { languages: richLanguages } = useLanguages();

  const [isOpen, setIsOpen] = useState(false);
  const [focusIndex, setFocusIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  // Build language list from available sources
  const localeCodes = useMemo(
    () => getAvailableLocales(richLanguages),
    [richLanguages],
  );

  // Merge: use rich LanguageOption when available, fallback to bare codes
  const languages: LanguageOption[] = useMemo(() => {
    if (richLanguages.length > 0) return richLanguages;
    return localeCodes.map((code) => ({ code }));
  }, [localeCodes, richLanguages]);

  // Extract current locale from URL (first path segment)
  const currentLocale = useMemo(() => {
    const segments = location.pathname.split("/").filter(Boolean);
    return segments[0] || "en";
  }, [location.pathname]);

  const currentLanguage = useMemo(
    () => languages.find((l) => l.code === currentLocale),
    [languages, currentLocale],
  );

  const currentLabel = currentLanguage
    ? getLabel(currentLanguage)
    : currentLocale.toUpperCase();

  const canToggle = languages.length > 1;

  // Navigate to same page with new locale — always keeps prefix
  const handleSwitch = useCallback(
    (newLocale: string) => {
      if (newLocale === currentLocale) {
        setIsOpen(false);
        return;
      }

      // Simple regex: replace first path segment with new locale
      // /tr/collection/article → /ar/collection/article
      const newPath = location.pathname.replace(/^\/[^/]+/, `/${newLocale}`);
      router.navigate({ to: newPath });
      setIsOpen(false);
      setFocusIndex(-1);
    },
    [currentLocale, location.pathname, router],
  );

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;
    function handleClick(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [isOpen]);

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!isOpen) {
        if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setIsOpen(true);
          setFocusIndex(0);
        }
        return;
      }

      switch (e.key) {
        case "Escape":
          e.preventDefault();
          setIsOpen(false);
          setFocusIndex(-1);
          break;
        case "ArrowDown":
          e.preventDefault();
          setFocusIndex((prev) =>
            prev < languages.length - 1 ? prev + 1 : 0,
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setFocusIndex((prev) =>
            prev > 0 ? prev - 1 : languages.length - 1,
          );
          break;
        case "Enter":
        case " ": {
          e.preventDefault();
          const lang = languages[focusIndex];
          if (lang) handleSwitch(lang.code);
          break;
        }
      }
    },
    [isOpen, focusIndex, languages, handleSwitch],
  );

  if (!canToggle) return null;

  return (
    <div ref={containerRef} className="relative inline-block">
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        onKeyDown={handleKeyDown}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label="Select language"
        className="inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium text-mist-600 transition-colors hover:text-mist-900"
      >
        <FlagIcon language={currentLanguage} label={currentLabel} />
        <span>{currentLabel}</span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className="text-mist-400 transition-transform duration-200"
          style={{ transform: isOpen ? "rotate(180deg)" : undefined }}
        >
          <path d="M20 9L13.4142 15.5858C12.6332 16.3668 11.3669 16.3668 10.5858 15.5858L4 9" />
        </svg>
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <ul
          role="listbox"
          aria-label="Available languages"
          className="absolute right-0 top-full z-50 mt-1 max-h-[70vh] min-w-[200px] overflow-y-auto rounded-xl border border-mist-200 bg-white p-0 shadow-lg"
        >
          {languages.map((language, index) => {
            const label = getLabel(language);
            const isActive = language.code === currentLocale;
            const isFocused = index === focusIndex;

            return (
              <li
                key={language.code}
                role="option"
                aria-selected={isActive}
                onClick={() => handleSwitch(language.code)}
                onMouseEnter={() => setFocusIndex(index)}
                className={[
                  "flex cursor-pointer items-center gap-3 px-3.5 py-2 text-sm transition-colors",
                  isActive ? "bg-mist-50" : "",
                  isFocused && !isActive ? "bg-mist-100" : "",
                ].join(" ")}
              >
                <FlagIcon language={language} label={label} />
                <span className="flex-1 text-mist-900">
                  {label}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-wider text-mist-400">
                  {language.code}
                </span>
                {isActive && (
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                    className="text-mist-600"
                  >
                    <path d="M6 12l4.243 4.243L18.485 8" />
                  </svg>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

// ─── Flag sub-component ─────────────────────────────────────────────

function FlagIcon({
  language,
  label,
}: {
  language: LanguageOption | undefined;
  label: string;
}) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [language?.flagUrl]);

  if (language?.flagUrl && !hasError) {
    return (
      <img
        src={language.flagUrl}
        alt={label}
        className="h-4 w-5 shrink-0 rounded-sm object-cover"
        loading="lazy"
        onError={() => setHasError(true)}
      />
    );
  }

  // Fallback: globe icon
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="square"
      aria-hidden="true"
      className="shrink-0 text-mist-400"
    >
      <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" />
      <path d="M21 12H3" />
      <path d="M12 21C10.067 21 8.5 16.9706 8.5 12C8.5 7.02944 10.067 3 12 3C13.933 3 15.5 7.02944 15.5 12C15.5 16.9706 13.933 21 12 21Z" />
    </svg>
  );
}
