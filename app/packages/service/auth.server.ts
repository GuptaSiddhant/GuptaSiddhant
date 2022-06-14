import { Authenticator } from "remix-auth"
import { FormStrategy } from "remix-auth-form"
import invariant from "tiny-invariant"

import cookieSession from "./session.server"

export interface AuthUser {
  idToken: string
  refreshToken: string
  email: string
  expiresIn: string
}

const authenticator = new Authenticator<AuthUser>(cookieSession)

export default authenticator

export async function authenticateRoute(request: Request) {
  return authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  })
}

authenticator.use(
  new FormStrategy(async ({ form }) => {
    const email = form.get("email")?.toString()
    invariant(email, "email is required")

    const password = form.get("password")?.toString()
    invariant(password, "password is required")

    const user = await signInWithEmailPassword(email, password)
    if ("error" in user) throw new Error(user.error.message)

    const authUser: AuthUser = {
      idToken: user.idToken,
      refreshToken: user.refreshToken,
      email: user.email,
      expiresIn: user.expiresIn,
    }

    return authUser
  }),
  "emailPassword",
)

// Firebase Auth Rest API

const baseUrl = "https://identitytoolkit.googleapis.com/v1/accounts:"

async function signInWithEmailPassword(email: string, password: string) {
  const FIREBASE_API_KEY = process.env.FIREBASE_API_KEY
  if (!FIREBASE_API_KEY) throw new Error("FIREBASE_API_KEY must be set")

  const searchParams = new URLSearchParams({ key: FIREBASE_API_KEY })

  const response = await fetch(
    `${baseUrl}signInWithPassword?${searchParams.toString()}`,
    {
      method: "POST",
      body: JSON.stringify({ returnSecureToken: true, email, password }),
    },
  )

  const data = await response.json()

  if (response.status !== 200)
    return data as SignInWithEmailPasswordErrorResponse

  return data as SignInWithEmailPasswordSuccessResponse
}

export interface SignInWithEmailPasswordSuccessResponse {
  kind: "identitytoolkit#VerifyPasswordResponse"
  localId: string
  email: string
  displayName: string
  idToken: string
  registered: boolean
  refreshToken: string
  expiresIn: string
}

export interface SignInWithEmailPasswordErrorResponse {
  error: {
    code: number
    message: string
    errors: {}[]
  }
}
