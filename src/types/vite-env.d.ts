/// <reference types="vite/client" />

interface ViteTypeOptions {
  strictImportMetaEnv: unknown;
}

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_APP_VERSION: string;
  readonly VITE_LABEL_STUDIO_PROJECT_ID: string;
  readonly VITE_QUESTIONNAIRES_DUMMY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
