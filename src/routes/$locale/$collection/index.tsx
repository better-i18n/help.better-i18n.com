import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { HelpLayout } from "@/components/layout/help-layout";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { Badge } from "@/components/shared/badge";
import { getCollection, getArticles, getCollectionsWithCounts } from "@/lib/content";
import { formatMetaTags, getCanonicalLink, getAlternateLinks } from "@/lib/seo";
import { formatStructuredData, getCollectionPageSchema, getBreadcrumbSchema } from "@/lib/seo";
import { SITE_URL } from "@/lib/config";
import { getMetaMessages } from "@/lib/meta";
import type { MetaMessages } from "@/lib/meta";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/$locale/$collection/")({
  loader: async ({ params }) => {
    const { locale, collection: collectionSlug } = params;
    const [collection, articles, allCollections, meta] = await Promise.all([
      getCollection(collectionSlug, locale),
      getArticles(locale, collectionSlug),
      getCollectionsWithCounts(locale),
      getMetaMessages(locale),
    ]);
    return { collection, articles, allCollections, locale, collectionSlug, meta };
  },

  head: ({ loaderData, params }) => {
    const { locale, collection: collectionSlug } = params;
    const collection = loaderData?.collection;
    const meta = loaderData?.meta as MetaMessages | undefined;
    const helpCenterLabel = meta?.helpCenterLabel ?? "Help Center";
    const title = collection
      ? `${collection.title} | ${helpCenterLabel} | Better i18n`
      : `${helpCenterLabel} | Better i18n`;
    const description = collection?.description
      || meta?.collectionDefaultDescription
      || "Browse help articles for this category.";

    return {
      meta: formatMetaTags({ title, description, locale, siteName: meta ? `Better i18n ${meta.helpCenterLabel}` : undefined, collection: collection?.title, ogTitle: collection?.title }),
      links: [
        getCanonicalLink(locale, `${collectionSlug}`),
        ...getAlternateLinks(`/${locale}/${collectionSlug}/`),
      ],
      scripts: [
        ...formatStructuredData([
          getCollectionPageSchema({
            name: collection?.title || collectionSlug,
            description,
            url: `${SITE_URL}/${locale}/${collectionSlug}/`,
            inLanguage: locale,
          }),
          getBreadcrumbSchema([
            { name: helpCenterLabel, url: `${SITE_URL}/${locale}/` },
            { name: collection?.title || collectionSlug, url: `${SITE_URL}/${locale}/${collectionSlug}/` },
          ]),
        ]),
      ],
    };
  },

  component: CollectionPage,
});

function CollectionPage() {
  const { collection, articles, allCollections, locale } = Route.useLoaderData();
  const t = useT("collection");
  const tArticle = useT("article");

  if (!collection) {
    return (
      <HelpLayout locale={locale} collections={allCollections}>
        <div className="mx-auto max-w-5xl px-6 py-16 text-center md:px-8">
          <h1 className="text-2xl font-semibold text-mist-950">
            {t("notFound")}
          </h1>
        </div>
      </HelpLayout>
    );
  }

  return (
    <HelpLayout locale={locale} collections={allCollections}>
      {/* Gray header zone — matches home page hero bg */}
      <div className="bg-mist-50 pb-8 md:pb-10">
        <div className="mx-auto max-w-5xl px-6 md:px-8">
          {/* Breadcrumb */}
          <div className="pt-5 pb-6">
            <Breadcrumb locale={locale} items={[{ label: collection.title }]} />
          </div>

          {/* Collection title */}
          <h1 className="text-2xl font-semibold tracking-tight text-mist-950 md:text-3xl">
            {collection.title}
          </h1>
          {collection.description && (
            <p className="mt-2 text-base text-mist-500">{collection.description}</p>
          )}
        </div>
      </div>

      {/* Article list */}
      <div className="mx-auto max-w-5xl px-6 pt-8 pb-16 md:px-8 md:pt-10">
        <div className="space-y-1">
          {articles.map((article) => (
            <Link
              key={article.slug}
              to="/$locale/$collection/$article/"
              params={{
                locale,
                collection: collection.slug,
                article: article.slug,
              }}
              className="group flex items-center gap-4 rounded-xl px-4 py-3.5 transition-colors hover:bg-mist-50"
            >
              <div className="flex-1 min-w-0">
                <h3 className="text-[15px] font-medium text-mist-700 transition-colors group-hover:text-mist-950">
                  {article.title}
                </h3>
                {article.excerpt && (
                  <p className="mt-0.5 truncate text-sm text-mist-400">{article.excerpt}</p>
                )}
              </div>
              <div className="flex items-center gap-3 shrink-0">
                {article.difficulty && (
                  <Badge variant={article.difficulty}>
                    {tArticle(`difficulty.${article.difficulty}`)}
                  </Badge>
                )}
                {article.readingTime && (
                  <span className="text-[13px] text-mist-400">{article.readingTime} {t("minSuffix")}</span>
                )}
              </div>
            </Link>
          ))}
          {articles.length === 0 && (
            <div className="py-12 text-center text-sm text-mist-500">
              {t("noArticles")}
            </div>
          )}
        </div>
      </div>
    </HelpLayout>
  );
}
