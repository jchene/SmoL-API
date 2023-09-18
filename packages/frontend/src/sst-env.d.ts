/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_REGION: string
  readonly VITE_S3_BUCKET_NAME: string
  readonly VITE_S3_REGION: string
}
interface ImportMeta {
  readonly env: ImportMetaEnv
}