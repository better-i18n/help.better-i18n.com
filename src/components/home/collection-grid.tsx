import { CollectionCard } from "./collection-card";
import type { HelpCollection } from "@/lib/content";

interface CollectionGridProps {
  collections: HelpCollection[];
  locale: string;
}

export function CollectionGrid({ collections, locale }: CollectionGridProps) {
  if (collections.length === 0) return null;

  return (
    <section className="mx-auto max-w-5xl px-6 pt-8 pb-12 md:px-8 md:pt-12 md:pb-16">
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 md:gap-6">
        {collections.map((col) => (
          <CollectionCard key={col.id} collection={col} locale={locale} />
        ))}
      </div>
    </section>
  );
}
