import type { ServiceAccount } from "firebase-admin/lib/app/credential";

import parsedEnv from "@gs/env";

export function googleServiceAccount(): ServiceAccount {
  const serviceAccount = parsedEnv.FIREBASE_SERVICE_ACCOUNT_KEY;

  return {
    clientEmail: serviceAccount.client_email,
    privateKey: serviceAccount.private_key,
    projectId: serviceAccount.project_id,
    ...serviceAccount,
  };
}
