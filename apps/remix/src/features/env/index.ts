import { parseEnv, z } from "znv";

import { FIREBASE_API_KEY, FIREBASE_SERVICE_ACCOUNT_KEY } from "./firebase.env";
import {
  UPSTASH_REDIS_REST_TOKEN,
  UPSTASH_REDIS_REST_URL,
} from "./upstash.env";

const parsedEnv = parseEnv(process.env, {
  FIREBASE_API_KEY,
  FIREBASE_SERVICE_ACCOUNT_KEY,

  UPSTASH_REDIS_REST_TOKEN,
  UPSTASH_REDIS_REST_URL,

  CACHE_TTL: z.number().optional(),
  SESSION_SECRET: z.string().min(1),
});

export default parsedEnv;
