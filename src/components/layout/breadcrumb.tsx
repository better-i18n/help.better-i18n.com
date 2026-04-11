import { Link } from "@tanstack/react-router";
import { useT } from "@/lib/i18n";

export interface BreadcrumbItem {
  label: string;
  href?: string;
  locale?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  locale: string;
}

export function Breadcrumb({ items, locale }: BreadcrumbProps) {
  const t = useT("common");

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[13px] text-mist-400">
      <Link
        to="/$locale/"
        params={{ locale }}
        className="transition-colors hover:text-mist-700"
      >
        {t("breadcrumb.helpCenter")}
      </Link>
      {items.map((item, index) => (
        <span key={index} className="flex items-center gap-1.5">
          <span className="text-mist-300">/</span>
          {item.href ? (
            <Link to={item.href} className="transition-colors hover:text-mist-700">
              {item.label}
            </Link>
          ) : (
            <span className="text-mist-600">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
