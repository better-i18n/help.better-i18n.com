import { Link } from "@tanstack/react-router";
import { useT } from "@/lib/i18n";
import type { HelpArticleListItem } from "@/lib/content";

interface PopularArticlesProps {
  articles: HelpArticleListItem[];
  locale: string;
}

export function PopularArticles({ articles, locale }: PopularArticlesProps) {
  const t = useT("home");

  if (articles.length === 0) return null;

  return (
    <section className="mx-auto max-w-5xl px-6 pb-12 md:px-8">
      <h2 className="text-base font-semibold text-mist-950">
        {t("popularArticles")}
      </h2>
      <ul className="mt-4 space-y-1">
        {articles.map((article) => (
          <li key={article.slug}>
            <Link
              to="/$locale/$collection/$article/"
              params={{
                locale,
                collection: article.collectionSlug || "general",
                article: article.slug,
              }}
              className="group flex items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-mist-50"
            >
              <span className="flex-1 text-sm text-mist-600 transition-colors group-hover:text-mist-950">
                {article.title}
              </span>
              {article.readingTime && (
                <span className="text-xs text-mist-400 shrink-0">
                  {article.readingTime} min
                </span>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
