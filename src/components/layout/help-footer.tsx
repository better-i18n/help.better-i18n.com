import { useT } from "@/lib/i18n";
import { LANDING_URL, SITE_NAME, LOGO_URL } from "@/lib/config";

export function HelpFooter({ locale: _locale }: { locale: string }) {
  const t = useT("common");

  return (
    <footer className="mt-28 p-4 md:mt-32">
      <div className="flex w-full items-center justify-center py-2.5">
        <a
          href={LANDING_URL || "#"}
          className="flex items-center justify-center gap-1.5 text-sm text-mist-400 underline-offset-2 hover:underline"
        >
          <span>{t("footer.craftedWith", { defaultValue: "Crafted with" })}</span>
          <span className="flex items-center gap-1.5">
            <img
              src={LOGO_URL || "/logo.svg"}
              alt={SITE_NAME}
              width={14}
              height={14}
              className="shrink-0 dark:invert"
            />
            <span className="font-medium text-mist-600">{SITE_NAME}</span>
          </span>
        </a>
      </div>
    </footer>
  );
}
