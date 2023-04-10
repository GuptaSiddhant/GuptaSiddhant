import type { ServiceAccount } from "firebase-admin/lib/app/credential";
import type { CredentialBody } from "google-auth-library/build/src/auth/credentials";

import parsedEnv from "@gs/env";

export function googleServiceAccount(): CredentialBody & ServiceAccount {
  const serviceAccount = parsedEnv.FIREBASE_SERVICE_ACCOUNT_KEY;

  return {
    clientEmail: serviceAccount.client_email,
    privateKey: serviceAccount.private_key,
    projectId: serviceAccount.project_id,
    ...serviceAccount,
  };
}
