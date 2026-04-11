import { Link } from "@tanstack/react-router";
import { useT } from "@/lib/i18n";
import type { HelpArticleListItem } from "@/lib/content";

interface ArticleNavProps {
  prev: HelpArticleListItem | null;
  next: HelpArticleListItem | null;
  locale: string;
}

export function ArticleNav({ prev, next, locale }: ArticleNavProps) {
  const t = useT("article");

  if (!prev && !next) return null;

  return (
    <div className="flex items-stretch gap-4 pt-2">
      {prev ? (
        <Link
          to="/$locale/$collection/$article/"
          params={{
            locale,
            collection: prev.collectionSlug || "general",
            article: prev.slug,
          }}
          className="group flex flex-1 flex-col gap-0.5"
        >
          <span className="text-xs text-mist-400">{t("prev")}</span>
          <span className="text-sm text-mist-500 transition-colors group-hover:text-mist-950">
            {prev.title}
          </span>
        </Link>
      ) : (
        <div className="flex-1" />
      )}

      {next ? (
        <Link
          to="/$locale/$collection/$article/"
          params={{
            locale,
            collection: next.collectionSlug || "general",
            article: next.slug,
          }}
          className="group flex flex-1 flex-col items-end gap-0.5 text-right"
        >
          <span className="text-xs text-mist-400">{t("next")}</span>
          <span className="text-sm text-mist-500 transition-colors group-hover:text-mist-950">
            {next.title}
          </span>
        </Link>
      ) : (
        <div className="flex-1" />
      )}
    </div>
  );
}
