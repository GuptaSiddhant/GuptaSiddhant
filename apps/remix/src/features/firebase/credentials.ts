import invariant from "@gs/utils/invariant";

export function googleServiceAccount() {
  const FIREBASE_SERVICE_ACCOUNT_KEY = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  invariant(
    FIREBASE_SERVICE_ACCOUNT_KEY,
    "Env FIREBASE_SERVICE_ACCOUNT_KEY is required.",
  );

  const serviceAccount = JSON.parse(FIREBASE_SERVICE_ACCOUNT_KEY);

  return serviceAccount;
}
