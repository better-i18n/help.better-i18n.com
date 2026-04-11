import { createFileRoute } from "@tanstack/react-router";
import { HelpLayout } from "@/components/layout/help-layout";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { ArticleBody } from "@/components/article/article-body";
import { TableOfContents } from "@/components/article/table-of-contents";
import { ArticleMeta } from "@/components/article/article-meta";
import { FeedbackWidget } from "@/components/article/feedback-widget";
import { RelatedArticles } from "@/components/article/related-articles";
import { ArticleNav } from "@/components/article/article-nav";
import { getArticle, getArticles, getCollection, getCollectionsWithCounts } from "@/lib/content";
import { addHeadingIds, extractTocFromHtml, stripFirstH1 } from "@/lib/utils";
import { formatMetaTags, getCanonicalLink, getAlternateLinks } from "@/lib/seo";
import { formatStructuredData, getArticleSchema, getBreadcrumbSchema } from "@/lib/seo";
import { SITE_URL, OG_BASE_URL } from "@/lib/config";
import { fetchLocales } from "@/lib/locales";
import { getMetaMessages } from "@/lib/meta";
import type { MetaMessages } from "@/lib/meta";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/$locale/$collection/$article")({
  loader: async ({ params }) => {
    const { locale, collection: collectionSlug, article: articleSlug } = params;
    const [article, collection, collectionArticles, allCollections, meta, locales] = await Promise.all([
      getArticle(articleSlug, locale),
      getCollection(collectionSlug, locale),
      getArticles(locale, collectionSlug),
      getCollectionsWithCounts(locale),
      getMetaMessages(locale),
      fetchLocales(),
    ]);

    // Find prev/next articles in the collection
    const currentIndex = collectionArticles.findIndex((a) => a.slug === articleSlug);
    const prev = currentIndex > 0 ? collectionArticles[currentIndex - 1] : null;
    const next = currentIndex < collectionArticles.length - 1 ? collectionArticles[currentIndex + 1] : null;

    // Related articles (same collection, excluding current)
    const relatedArticles = collectionArticles
      .filter((a) => a.slug !== articleSlug)
      .slice(0, 3);

    return { article, collection, allCollections, prev, next, relatedArticles, locale, collectionSlug, meta, locales };
  },

  head: ({ loaderData, params }) => {
    const { locale, collection: collectionSlug, article: articleSlug } = params;
    const article = loaderData?.article;
    const collection = loaderData?.collection;
    const meta = loaderData?.meta as MetaMessages | undefined;
    const helpCenterLabel = meta?.helpCenterLabel ?? "Help Center";

    const title = article?.seoTitle || article?.title || articleSlug;
    const description = article?.seoDescription || article?.excerpt || "";
    const fullTitle = `${title} | ${collection?.title || collectionSlug} | Better i18n`;
    const articleUrl = `${SITE_URL}/${locale}/${collectionSlug}/${articleSlug}/`;
    const locales = loaderData?.locales ?? ["en"];

    // Build OG image URL for structured data
    const ogParams = new URLSearchParams({ title });
    if (description) ogParams.set("description", description);
    if (collection?.title) ogParams.set("collection", collection.title);
    const ogImageUrl = article?.featuredImage
      ?? (OG_BASE_URL ? `${OG_BASE_URL}/og/help?${ogParams.toString()}` : undefined);

    return {
      meta: formatMetaTags({
        title: fullTitle,
        description,
        locale,
        locales,
        pathname: `${collectionSlug}/${articleSlug}`,
        siteName: meta ? `Better i18n ${meta.helpCenterLabel}` : undefined,
        ogType: "article",
        articlePublishedTime: article?.lastReviewedAt || undefined,
        articleSection: collection?.title || undefined,
        collection: collection?.title || undefined,
        ogTitle: title,
        ogImage: article?.featuredImage || undefined,
      }),
      links: [
        getCanonicalLink(locale, `${collectionSlug}/${articleSlug}`),
        ...getAlternateLinks(`/${locale}/${collectionSlug}/${articleSlug}/`),
      ],
      scripts: [
        ...formatStructuredData([
          getArticleSchema({
            title: fullTitle,
            description,
            url: articleUrl,
            dateModified: article?.lastReviewedAt || undefined,
            datePublished: article?.lastReviewedAt || undefined,
            author: "Better i18n",
            wordCount: article?.readingTime ? article.readingTime * 200 : undefined,
            image: ogImageUrl,
            inLanguage: locale,
          }),
          getBreadcrumbSchema([
            { name: helpCenterLabel, url: `${SITE_URL}/${locale}/` },
            { name: collection?.title || collectionSlug, url: `${SITE_URL}/${locale}/${collectionSlug}/` },
            { name: title, url: articleUrl },
          ]),
        ]),
      ],
    };
  },

  component: ArticlePage,
});

function ArticlePage() {
  const { article, collection, allCollections, prev, next, relatedArticles, locale, collectionSlug } =
    Route.useLoaderData();
  const t = useT("article");

  if (!article) {
    return (
      <HelpLayout locale={locale} collections={allCollections}>
        <div className="mx-auto max-w-3xl px-6 py-16 text-center">
          <h1 className="text-2xl font-semibold text-mist-950">
            {t("notFound")}
          </h1>
        </div>
      </HelpLayout>
    );
  }

  const processedHtml = article.bodyHtml ? addHeadingIds(stripFirstH1(article.bodyHtml)) : "";
  const tocItems = processedHtml ? extractTocFromHtml(processedHtml) : [];

  return (
    <HelpLayout locale={locale} collections={allCollections}>
      {/* Gray header zone */}
      <div className="bg-mist-50 pb-8 md:pb-10">
        <div className="mx-auto max-w-5xl px-6 md:px-8">
          {/* Breadcrumb */}
          <div className="pt-5 pb-6">
            <Breadcrumb
              locale={locale}
              items={[
                {
                  label: collection?.title || collectionSlug,
                  href: `/${locale}/${collectionSlug}/`,
                },
                { label: article.title },
              ]}
            />
          </div>

          {/* Article title in gray zone */}
          <h1 className="text-2xl font-semibold leading-tight tracking-tight text-mist-950 md:text-3xl">
            {article.title}
          </h1>
          {article.excerpt && (
            <p className="mt-2 text-base leading-relaxed text-mist-500">{article.excerpt}</p>
          )}
          <div className="mt-2">
            <ArticleMeta article={article} locale={locale} />
          </div>
        </div>
      </div>

      {/* Content + sidebar */}
      <div className="mx-auto max-w-5xl px-6 md:px-8">
        <div className="flex gap-12">
          {/* Main content */}
          <article className="min-w-0 flex-1 pt-8 pb-16 md:pt-10">

            {/* Featured image */}
            {article.featuredImage && (
              <div className="mb-10 overflow-hidden rounded-xl border border-mist-100">
                <img
                  src={article.featuredImage}
                  alt={article.title}
                  className="w-full h-auto"
                  loading="eager"
                />
              </div>
            )}

            {/* Video embed */}
            {article.videoUrl && (
              <div className="mb-10 aspect-video overflow-hidden rounded-xl border border-mist-100">
                <iframe
                  src={article.videoUrl}
                  className="h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={article.title}
                />
              </div>
            )}

            {/* Article body */}
            {processedHtml && <ArticleBody html={processedHtml} />}

            {/* Feedback + Nav */}
            <div className="mt-14 space-y-6">
              <FeedbackWidget articleSlug={article.slug} />
              <ArticleNav prev={prev} next={next} locale={locale} />
            </div>
          </article>

          {/* Right sidebar: TOC + Related */}
          <aside className="hidden w-52 shrink-0 lg:block">
            <div className="sticky top-6 space-y-10 pt-8 md:pt-10">
              <TableOfContents items={tocItems} />
              <RelatedArticles articles={relatedArticles} locale={locale} />
            </div>
          </aside>
        </div>
      </div>
    </HelpLayout>
  );
}
