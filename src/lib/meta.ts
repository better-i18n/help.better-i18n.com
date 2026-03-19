/**
 * Meta message loading for localized SEO tags.
 *
 * Each route's loader calls `getMetaMessages(locale)` to fetch i18n messages
 * from the CDN. The root loader already populates TtlCache, so this call
 * hits the in-memory cache — no duplicate CDN request.
 *
 * Route head() functions then use these messages for localized title,
 * description, OG tags, and structured data breadcrumbs.
 */

import type { Messages } from "@better-i18n/use-intl";
import { getMessages } from "@better-i18n/use-intl/server";
import { i18nConfig } from "../i18n.config";

/**
 * Subset of i18n messages needed by head() functions.
 * Kept minimal to avoid bloating the serialized loader payload.
 */
export interface MetaMessages {
  /** e.g. "Yardım Merkezi | Better i18n" */
  homeTitle: string;
  /** e.g. "Better i18n için cevaplar, kılavuzlar ve kaynaklar bulun..." */
  homeDescription: string;
  /** e.g. "SSS | Better i18n Yardım Merkezi" */
  faqTitle: string;
  /** e.g. "Better i18n hakkında sık sorulan soruların cevaplarını bulun..." */
  faqDescription: string;
  /** e.g. "Bu kategori için yardım makalelerine göz atın." */
  collectionDefaultDescription: string;
  /** e.g. "Yardım Merkezi" — for breadcrumbs and title suffixes */
  helpCenterLabel: string;
  /** e.g. "SSS" — for breadcrumbs */
  faqLabel: string;
}

/** Default English fallbacks (matches source text in Better i18n CDN) */
const DEFAULTS: MetaMessages = {
  homeTitle: "Help Center | Better i18n",
  homeDescription:
    "Find answers, guides, and resources for Better i18n. Learn how to manage translations, set up integrations, and get the most out of the platform.",
  faqTitle: "FAQ | Better i18n Help Center",
  faqDescription:
    "Find answers to common questions about Better i18n — translations, integrations, and more.",
  collectionDefaultDescription: "Browse help articles for this category.",
  helpCenterLabel: "Help Center",
  faqLabel: "FAQ",
};

/**
 * Access a nested value from the messages object using dot notation.
 */
function getNestedValue(messages: Messages, path: string): string | undefined {
  const keys = path.split(".");
  let current: unknown = messages;
  for (const key of keys) {
    if (current === null || current === undefined || typeof current !== "object") {
      return undefined;
    }
    current = (current as Record<string, unknown>)[key];
  }
  return typeof current === "string" ? current : undefined;
}

/**
 * Extract the meta-relevant subset from full i18n messages.
 */
function extractMetaMessages(messages: Messages): MetaMessages {
  return {
    homeTitle: getNestedValue(messages, "home.seo.title") ?? DEFAULTS.homeTitle,
    homeDescription: getNestedValue(messages, "home.seo.description") ?? DEFAULTS.homeDescription,
    faqTitle: getNestedValue(messages, "faq.seo.title") ?? DEFAULTS.faqTitle,
    faqDescription: getNestedValue(messages, "faq.seo.description") ?? DEFAULTS.faqDescription,
    collectionDefaultDescription:
      getNestedValue(messages, "collection.seo.defaultDescription") ?? DEFAULTS.collectionDefaultDescription,
    helpCenterLabel: getNestedValue(messages, "common.breadcrumb.helpCenter") ?? DEFAULTS.helpCenterLabel,
    faqLabel: getNestedValue(messages, "faq.breadcrumb.label") ?? DEFAULTS.faqLabel,
  };
}

/**
 * Fetch i18n messages from CDN and extract meta-relevant values.
 * Safe to call from every route loader — TtlCache deduplicates CDN fetches.
 */
export async function getMetaMessages(locale: string): Promise<MetaMessages> {
  try {
    const messages = await getMessages({
      project: i18nConfig.project,
      locale,
    });
    return extractMetaMessages(messages);
  } catch {
    return DEFAULTS;
  }
}
