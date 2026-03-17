# help.better-i18n.com

Multilingual help center powered by [Better i18n](https://better-i18n.com). Built with TanStack Start, deployed on Cloudflare Workers.

## Stack

- **Framework:** [TanStack Start](https://tanstack.com/start) (React 19 + SSR)
- **Styling:** Tailwind CSS v4
- **i18n:** [Better i18n](https://better-i18n.com) — `@better-i18n/use-intl` + `@better-i18n/sdk`
- **CMS:** Better i18n Content SDK (headless)
- **Deploy:** Cloudflare Workers + Assets

## Setup

```bash
# Install dependencies
bun install

# Copy environment variables
cp .env.example .env
# Edit .env with your Better i18n project and API key

# Start dev server
bun dev
```

## Environment Variables

See [`.env.example`](.env.example) for all available variables.

| Variable | Required | Description |
|---|---|---|
| `BETTER_I18N_PROJECT` | Yes | Project identifier (`org/project`) |
| `BETTER_I18N_CONTENT_API_KEY` | Yes | Content API key from Dashboard |
| `PUBLIC_SITE_URL` | No | Help center URL |
| `PUBLIC_SITE_NAME` | No | Site name shown in header/footer |

## Scripts

```bash
bun dev        # Start dev server on port 3003
bun run build  # Build for production (SSR + worker)
bun run preview # Preview with wrangler (port 8991)
bun run deploy # Build + deploy to Cloudflare
```

## Deployment

Deployed as a Cloudflare Worker with static assets. Edit `wrangler.jsonc` to configure your domain routing.

## License

MIT
