import { z } from "zod";

const firebaseServiceAccountKeySchema = z.object({
  type: z.literal("service_account"),
  project_id: z.string(),
  private_key_id: z.string(),
  private_key: z.string(),
  client_email: z.string().email().optional(),
  client_id: z.string(),
  auth_uri: z.string().url(),
  token_uri: z.string().url(),
  auth_provider_x509_cert_url: z.string().url().optional(),
  client_x509_cert_url: z.string().url().optional(),
});

export const FIREBASE_SERVICE_ACCOUNT_KEY = z
  .string()
  .trim()
  .min(1)
  .startsWith("{")
  .endsWith("}")
  .transform((val) => firebaseServiceAccountKeySchema.parse(JSON.parse(val)));

export const FIREBASE_API_KEY = z.string().min(1);
