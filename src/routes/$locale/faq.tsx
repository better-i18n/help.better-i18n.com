import { createFileRoute } from "@tanstack/react-router";
import { HelpLayout } from "@/components/layout/help-layout";
import { FaqAccordion } from "@/components/faq/faq-accordion";
import { getFaqs, getCollections } from "@/lib/content";
import type { HelpFaq, HelpCollection } from "@/lib/content";
import {
  formatMetaTags,
  getCanonicalLink,
  getAlternateLinks,
  formatStructuredData,
  getFAQSchema,
  getBreadcrumbSchema,
} from "@/lib/seo";
import { SITE_URL } from "@/lib/config";
import { getMetaMessages } from "@/lib/meta";
import type { MetaMessages } from "@/lib/meta";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/$locale/faq")({
  loader: async ({ params }) => {
    const { locale } = params;
    const [faqs, collections, meta] = await Promise.all([
      getFaqs(locale),
      getCollections(locale),
      getMetaMessages(locale),
    ]);

    // Group FAQs by collection
    const collectionMap = new Map(collections.map((c) => [c.slug, c]));
    const grouped = new Map<string | null, HelpFaq[]>();

    for (const faq of faqs) {
      const key = faq.collectionSlug;
      if (!grouped.has(key)) grouped.set(key, []);
      grouped.get(key)!.push(faq);
    }

    const groups: Array<{ collection: HelpCollection | null; faqs: HelpFaq[] }> = [];

    // Collection-grouped FAQs first, then ungrouped
    for (const [slug, faqList] of grouped) {
      if (slug) {
        groups.push({ collection: collectionMap.get(slug) ?? null, faqs: faqList });
      }
    }
    const ungrouped = grouped.get(null);
    if (ungrouped) {
      groups.unshift({ collection: null, faqs: ungrouped });
    }

    return { faqs, groups, collections, locale, meta };
  },

  head: ({ params, loaderData }) => {
    const { locale } = params;
    const faqs = loaderData?.faqs ?? [];
    const meta = loaderData?.meta as MetaMessages | undefined;
    const helpCenterLabel = meta?.helpCenterLabel ?? "Help Center";
    const faqLabel = meta?.faqLabel ?? "FAQ";

    const faqItems = faqs
      .filter((f: HelpFaq) => f.bodyHtml)
      .map((f: HelpFaq) => ({
        question: f.title,
        answer: f.bodyHtml!,
      }));

    return {
      meta: formatMetaTags({
        title: meta?.faqTitle ?? "FAQ | Better i18n Help Center",
        description: meta?.faqDescription ?? "Find answers to common questions about Better i18n — translations, integrations, and more.",
        locale,
        pathname: "faq",
        siteName: meta ? `Better i18n ${meta.helpCenterLabel}` : undefined,
      }),
      links: [
        getCanonicalLink(locale, "faq"),
        ...getAlternateLinks(`/${locale}/faq/`),
      ],
      scripts: [
        ...formatStructuredData([
          ...(faqItems.length > 0 ? [getFAQSchema(faqItems, locale)] : []),
          getBreadcrumbSchema([
            { name: helpCenterLabel, url: `${SITE_URL}/${locale}/` },
            { name: faqLabel, url: `${SITE_URL}/${locale}/faq/` },
          ]),
        ]),
      ],
    };
  },

  component: FaqPage,
});

function FaqPage() {
  const { faqs, groups, collections, locale } = Route.useLoaderData();
  const t = useT("faq");

  return (
    <HelpLayout locale={locale} collections={collections}>
      <div className="mx-auto max-w-3xl px-6 py-12">
        <header className="mb-10 text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-mist-950 sm:text-3xl">
            {t("title", "Frequently Asked Questions")}
          </h1>
          <p className="mt-3 text-mist-600">
            {t("description", "Find answers to common questions")}
          </p>
        </header>

        {faqs.length > 0 ? (
          <FaqAccordion groups={groups} />
        ) : (
          <div className="py-16 text-center text-mist-500">
            {t("noFaqs", "No FAQs available yet")}
          </div>
        )}
      </div>
    </HelpLayout>
  );
}
