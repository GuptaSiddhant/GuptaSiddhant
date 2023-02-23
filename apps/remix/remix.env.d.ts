/// <reference types="@remix-run/dev" />
/// <reference types="@remix-run/node/globals" />

import "@total-typescript/ts-reset";

declare namespace NodeJS {
  interface ProcessEnv {
    CACHE_TTL: string;
  }
}
