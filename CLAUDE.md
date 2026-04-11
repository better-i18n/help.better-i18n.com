# Help Center — Claude Code Context

## What This Is

Public-facing help center for Better i18n (`help.better-i18n.com`). SSR-rendered, SEO-optimized knowledge base with multilingual support, built on TanStack Start and deployed to Cloudflare Workers.

## AI Assistant Guidelines

- **NEVER start dev servers** — Do not run `bun dev`, `vite dev`, or `wrangler dev`
- **NEVER run build commands** — User handles builds and deployments
- **Package manager:** Bun (`bun install`, `bun run`, `bun test`)
- **Base branch:** `main`
- **Deploy target:** Cloudflare Workers (`wrangler deploy`)
- **Conventional commits required** — `feat:`, `fix:`, `refactor:`, `docs:`, `chore:`
- **Only stage files YOU changed** — use `git add <specific-files>`, NEVER `git add .`
- **Linear ticket'ları güncelle** — Commit sonrası ilgili Linear issue varsa (BETTER-xxx) `mcp__linear-server__save_issue` ile "Done" yap. Commit mesajında ticket ID referans ver.

## Tech Stack

- **Framework:** TanStack Start + TanStack Router (file-based routing)
- **Hosting:** Cloudflare Workers (custom `worker-entry.ts` wraps TanStack server handler)
- **Styling:** Tailwind CSS v4 + `@tailwindcss/typography`
- **React:** v19
- **Content:** `@better-i18n/sdk` (headless CMS content client)
- **i18n:** `@better-i18n/use-intl` + `@better-i18n/core`
- **Build:** Vite 7 with SSR prerendering (page list from CDN + Content SDK at build time)

## SSR i18n Pattern (CRITICAL)

The SSR i18n implementation is the most complex part of this codebase. All logic lives in `src/routes/__root.tsx`.

### `ssrMessagesByRequest` Side-Channel

```
Module-level Map<requestId, Messages> — bounded to 50 entries (LRU eviction)
```

Messages are NOT passed through loader serialization on SSR. Instead:
1. `beforeLoad` generates a `requestId` (crypto.randomUUID) and detects locale from URL path
2. `loader` fetches messages and stores them in `ssrMessagesByRequest.set(requestId, messages)`
3. `RootComponent` reads from the Map on server, deletes the entry immediately after consumption
4. Client hydrates from `#__i18n_messages__` script tag (injected as `application/json`)

### Flow Summary

```
Request → beforeLoad (locale detection + redirect if needed)
       → loader (fetch messages → store in Map on SSR, return on client)
       → RootComponent:
           SSR: read from Map → render → inject <script id="__i18n_messages__">
           Client: read from <script> tag → hydrate (no CDN re-fetch)
```

### Locale Detection & Redirect

- `beforeLoad` checks if the first path segment is a known locale
- If not, and not in `BYPASS_LOCALE_CHECK` (e.g., `"api"`), calls `detectLocale()` and throws a 301 redirect to `/${detectedLocale}${pathname}`
- Default locale has no special treatment — all routes are under `/$locale/...`

### Hydration Tags

```html
<script type="application/json" id="__i18n_messages__">{...}</script>
<script type="application/json" id="__i18n_locales__">[...]</script>
```

`getClientMessages()` reads and JSON-parses `#__i18n_messages__` on the client side — prevents redundant CDN fetch during hydration.

## `@better-i18n/core` Local Link (WARNING)

```json
"@better-i18n/core": "link:../better-i18n-oss/packages/core"
```

This is a Bun `link:` reference to `/Users/osman/Developer/better/oss/packages/core`. If `@better-i18n/core` APIs change in OSS, they immediately affect this project. Run `bun install` after core changes.

## Project Structure

```
helpcenter/
├── worker-entry.ts          # CF Worker entry (security headers, cache-control, ASSETS binding)
├── vite.config.ts           # TanStack Start + SSR prerender + sitemap
├── wrangler.jsonc           # CF Workers config
└── src/
    ├── i18n.config.ts       # project + defaultLocale ("en")
    ├── routes/
    │   ├── __root.tsx       # SSR i18n: ssrMessagesByRequest, beforeLoad, hydration
    │   ├── index.tsx        # "/" → detectLocale → 301 redirect to /$locale
    │   └── $locale/
    │       ├── index.tsx    # Home (collections + featured articles)
    │       ├── faq.tsx      # FAQ (grouped accordion)
    │       └── $collection/
    │           ├── index.tsx      # Collection listing
    │           └── $article.tsx   # Article detail (TOC, breadcrumb)
    ├── lib/
    │   ├── i18n.ts          # useT() hook (wraps useTranslations + fallback)
    │   ├── locales.ts       # fetchLocales() with SSR-injected cache
    │   ├── content.ts       # @better-i18n/sdk content client
    │   ├── seo.ts           # Meta tags, structured data, canonical/hreflang
    │   └── utils.ts         # TOC extraction, readingTime, etc.
    ├── middleware/
    │   └── i18n.ts          # createBetterI18nMiddleware wrapper
    ├── components/
    │   ├── layout/          # help-layout, header, footer, sidebar, mobile-nav
    │   ├── article/         # article-body, article-meta, article-nav, feedback, TOC
    │   ├── home/            # search-hero, collection-grid, popular-articles
    │   └── ui/              # command-palette
    └── seo/
        └── generate-pages.ts  # Build-time page/sitemap generator
```

## Key Files

| Task | File |
|------|------|
| SSR i18n pattern | `src/routes/__root.tsx` |
| i18n config | `src/i18n.config.ts` |
| Locale detection middleware | `src/middleware/i18n.ts` |
| Content fetching | `src/lib/content.ts` |
| SEO (meta, hreflang, structured data) | `src/lib/seo.ts` |
| CF Worker entry | `worker-entry.ts` |
| Build-time page generation | `src/seo/generate-pages.ts` |

## graphify

This project has a graphify knowledge graph at graphify-out/.

Rules:
- Before answering architecture or codebase questions, read graphify-out/GRAPH_REPORT.md for god nodes and community structure
- If graphify-out/wiki/index.md exists, navigate it instead of reading raw files
- After modifying code files in this session, run `python3 -c "from graphify.watch import _rebuild_code; from pathlib import Path; _rebuild_code(Path('.'))"` to keep the graph current

## Debugging (CRITICAL — Log + Code methodology)

When ANY error is reported or suspected, ALWAYS read logs FIRST:
1. **Logs first** → `ol tail helpcenter` or check `.openlogs/` — find exact error, stack trace, timestamp
2. **Code second** → With log context, read the failing file/line — understand WHY it broke
3. **Fix with precision** → Logs show reality, code shows intent. The gap = the bug.

**Never debug by code-reading alone.** You'll guess at symptoms and risk false fixes. Logs pinpoint; code explains. Together = surgical fix.
