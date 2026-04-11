import { useState } from "react";
import { useT } from "@/lib/i18n";

interface FeedbackWidgetProps {
  articleSlug: string;
}

export function FeedbackWidget({ articleSlug: _articleSlug }: FeedbackWidgetProps) {
  const t = useT("article");
  const [feedback, setFeedback] = useState<"up" | "down" | null>(null);

  if (feedback) {
    return (
      <div className="pt-4 text-center text-sm text-mist-400">
        {t("feedbackThanks")}
      </div>
    );
  }

  return (
    <div className="pt-4 text-center">
      <p className="text-sm text-mist-400">
        {t("feedbackQuestion")}
      </p>
      <div className="mt-2 flex items-center justify-center gap-2">
        <button
          type="button"
          onClick={() => setFeedback("up")}
          className="cursor-pointer rounded-full bg-mist-50 px-4 py-1.5 text-sm text-mist-500 transition-colors hover:bg-emerald-50 hover:text-emerald-700"
        >
          {t("feedbackYes")}
        </button>
        <button
          type="button"
          onClick={() => setFeedback("down")}
          className="cursor-pointer rounded-full bg-mist-50 px-4 py-1.5 text-sm text-mist-500 transition-colors hover:bg-rose-50 hover:text-rose-700"
        >
          {t("feedbackNo")}
        </button>
      </div>
    </div>
  );
}
