import { z } from "zod";

export const UPSTASH_REDIS_REST_TOKEN = z.string().min(1);

export const UPSTASH_REDIS_REST_URL = z
  .string()
  .url()
  .default("https://eu2-careful-bat-30655.upstash.io");
