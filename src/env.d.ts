/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly DEV: boolean;
  readonly BETTER_I18N_PROJECT: string;
  readonly BETTER_I18N_CONTENT_API_KEY: string;
  readonly PUBLIC_SITE_URL: string;
  readonly PUBLIC_SITE_NAME: string;
  readonly PUBLIC_DASHBOARD_URL: string;
  readonly PUBLIC_DOCS_URL: string;
  readonly PUBLIC_LANDING_URL: string;
  readonly PUBLIC_SIGNUP_URL: string;
  readonly PUBLIC_LOGO_URL: string;
  readonly PUBLIC_ORG_URL: string;
  readonly PUBLIC_ORG_LOGO_URL: string;
  readonly PUBLIC_OG_BASE_URL: string;
  readonly PUBLIC_SOCIAL_X: string;
  readonly PUBLIC_SOCIAL_GITHUB: string;
  readonly PUBLIC_SOCIAL_YOUTUBE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
