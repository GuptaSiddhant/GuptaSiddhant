import { z } from "zod";

import invariant from "@gs/utils/invariant";

export function googleServiceAccount() {
  const FIREBASE_SERVICE_ACCOUNT_KEY = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  invariant(
    FIREBASE_SERVICE_ACCOUNT_KEY,
    "Env FIREBASE_SERVICE_ACCOUNT_KEY is required.",
  );

  const serviceAccount = JSON.parse(FIREBASE_SERVICE_ACCOUNT_KEY);

  return z
    .object({
      type: z.string(),
      project_id: z.string(),
      private_key_id: z.string(),
      private_key: z.string(),
      client_email: z.string(),
      client_id: z.string(),
      auth_uri: z.string(),
      token_uri: z.string(),
      auth_provider_x509_cert_url: z.string(),
      client_x509_cert_url: z.string(),
    })
    .parse(serviceAccount);
}
