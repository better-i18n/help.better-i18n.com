import { useT } from "@/lib/i18n";
import { Badge } from "@/components/shared/badge";
import { formatDate } from "@/lib/utils";
import type { HelpArticle } from "@/lib/content";

interface ArticleMetaProps {
  article: HelpArticle;
  locale: string;
}

export function ArticleMeta({ article, locale }: ArticleMetaProps) {
  const t = useT("article");

  return (
    <div className="flex flex-wrap items-center gap-2 text-[13px] text-mist-400">
      {article.readingTime && (
        <span>{article.readingTime} {t("minRead")}</span>
      )}

      {article.readingTime && article.lastReviewedAt && (
        <span className="text-mist-200">&middot;</span>
      )}

      {article.lastReviewedAt && (
        <span>{t("updated")} {formatDate(article.lastReviewedAt, locale)}</span>
      )}

      {article.difficulty && (
        <>
          <span className="text-mist-200">&middot;</span>
          <Badge variant={article.difficulty}>
            {t(`difficulty.${article.difficulty}`)}
          </Badge>
        </>
      )}
    </div>
  );
}
