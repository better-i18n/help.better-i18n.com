export const i18nConfig = {
  project: import.meta.env.BETTER_I18N_PROJECT || "better-i18n/help",
  defaultLocale: "en",
  lint: {
    ignoreStrings: ["Breadcrumb", "GitHub", "YouTube", "Close navigation", "Select language", "Available languages", "Command palette", "Close", "Search results", "Better i18n"],
  },
};
