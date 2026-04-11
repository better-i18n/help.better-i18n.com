import { Link } from "@tanstack/react-router";
import { useT } from "@/lib/i18n";
import type { HelpArticleListItem } from "@/lib/content";

interface RelatedArticlesProps {
  articles: HelpArticleListItem[];
  locale: string;
}

export function RelatedArticles({ articles, locale }: RelatedArticlesProps) {
  const t = useT("article");

  if (articles.length === 0) return null;

  return (
    <div>
      <p className="mb-2 text-[13px] font-semibold text-mist-950">{t("relatedArticles")}</p>
      <ul className="space-y-0.5">
        {articles.map((article) => (
          <li key={article.slug}>
            <Link
              to="/$locale/$collection/$article/"
              params={{
                locale,
                collection: article.collectionSlug || "general",
                article: article.slug,
              }}
              className="block py-0.5 text-[13px] leading-relaxed text-mist-400 transition-colors hover:text-mist-950"
            >
              {article.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
