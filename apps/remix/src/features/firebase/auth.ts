import parsedEnv from "@gs/env";

const FIREBASE_AUTH_BASE_URL =
  "https://identitytoolkit.googleapis.com/v1/accounts:";

export async function signInWithEmailPassword(email: string, password: string) {
  const searchParams = new URLSearchParams({ key: parsedEnv.FIREBASE_API_KEY });

  const response = await fetch(
    `${FIREBASE_AUTH_BASE_URL}signInWithPassword?${searchParams.toString()}`,
    {
      method: "POST",
      body: JSON.stringify({ returnSecureToken: true, email, password }),
    },
  );

  const data = await response.json();

  if (response.status !== 200) {
    return data as SignInWithEmailPasswordErrorResponse;
  }

  return data as SignInWithEmailPasswordSuccessResponse;
}

// Types

interface SignInWithEmailPasswordSuccessResponse {
  kind: "identitytoolkit#VerifyPasswordResponse";
  localId: string;
  email: string;
  displayName: string;
  idToken: string;
  registered: boolean;
  refreshToken: string;
  expiresIn: string;
}

interface SignInWithEmailPasswordErrorResponse {
  error: {
    code: number;
    message: string;
    errors: unknown[];
  };
}
