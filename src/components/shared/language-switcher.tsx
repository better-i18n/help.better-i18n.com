import { LocaleDropdown } from "@better-i18n/use-intl";
import type { CSSProperties } from "react";

const vars = {
  "--better-locale-text": "var(--color-mist-600)",
  "--better-locale-trigger-bg": "transparent",
  "--better-locale-trigger-border": "1px solid transparent",
  "--better-locale-trigger-radius": "6px",
  "--better-locale-trigger-padding": "5px 12px",
  "--better-locale-border": "var(--color-border)",
  "--better-locale-menu-bg": "var(--color-card)",
  "--better-locale-hover-bg": "var(--color-mist-100)",
  "--better-locale-active-bg": "var(--color-mist-50)",
  "--better-locale-code-text": "var(--color-mist-400)",
  "--better-locale-accent": "var(--color-mist-600)",
} as CSSProperties;

export function LanguageSwitcher() {
  return (
    <div style={vars}>
      <LocaleDropdown />
    </div>
  );
}
