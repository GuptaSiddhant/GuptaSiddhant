import parsedEnv from "@gs/env";

const FIREBASE_AUTH_BASE_URL =
  "https://identitytoolkit.googleapis.com/v1/accounts";

export async function signInWithEmailPassword(email: string, password: string) {
  const searchParams = new URLSearchParams({ key: parsedEnv.FIREBASE_API_KEY });
  const response = await fetch(
    `${FIREBASE_AUTH_BASE_URL}:signInWithPassword?${searchParams.toString()}`,
    {
      method: "POST",
      body: JSON.stringify({ returnSecureToken: true, email, password }),
      headers: { "Content-Type": "application/json" },
    },
  );

  return (await response.json()) as
    | AuthErrorResponse
    | SignInWithEmailPasswordSuccessResponse;
}

export async function signUpAnonymously() {
  const searchParams = new URLSearchParams({ key: parsedEnv.FIREBASE_API_KEY });
  const response = await fetch(
    `${FIREBASE_AUTH_BASE_URL}:signUp?${searchParams.toString()}`,
    {
      method: "POST",
      body: JSON.stringify({ returnSecureToken: true }),
      headers: { "Content-Type": "application/json" },
    },
  );

  return (await response.json()) as
    | AuthErrorResponse
    | AnonymousSignUpSuccessResponse;
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

interface AuthErrorResponse {
  error: {
    code: number;
    message: string;
    errors: unknown[];
  };
}

interface AnonymousSignUpSuccessResponse {
  idToken: string;
  email: "";
  refreshToken: string;
  expiresIn: string;
  localId: string;
}
