import { parseEnv, z } from "znv";

import { FIREBASE_API_KEY, FIREBASE_SERVICE_ACCOUNT_KEY } from "./firebase.env";
import {
  UPSTASH_REDIS_REST_TOKEN,
  UPSTASH_REDIS_REST_URL,
} from "./upstash.env";

// znv is CommonJS and checks `instanceof z.ZodType`, which fails when the app
// loads zod as ESM (dual package hazard in the ESM server build). Passing the
// schemas as `{ schema }` specs avoids that check.
const parsedEnv = parseEnv(process.env, {
  FIREBASE_API_KEY: { schema: FIREBASE_API_KEY },
  FIREBASE_SERVICE_ACCOUNT_KEY: { schema: FIREBASE_SERVICE_ACCOUNT_KEY },

  UPSTASH_REDIS_REST_TOKEN: { schema: UPSTASH_REDIS_REST_TOKEN },
  UPSTASH_REDIS_REST_URL: { schema: UPSTASH_REDIS_REST_URL },

  CACHE_TTL: { schema: z.number().optional() },
  SESSION_SECRET: { schema: z.string().min(1) },
});

export default parsedEnv;
