import "@total-typescript/ts-reset";

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      CACHE_TTL: string;
    }
  }
}
