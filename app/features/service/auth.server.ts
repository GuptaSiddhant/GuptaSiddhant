import { signInWithEmailPassword } from "@gs/firebase/auth"
import { createCookieSessionStorage, redirect } from "@remix-run/node"
import { Authenticator } from "remix-auth"
import { FormStrategy } from "remix-auth-form"
import invariant from "tiny-invariant"

// Auth Session

const sessionSecret = process.env.SESSION_SECRET

if (!sessionSecret) {
  throw new Error("SESSION_SECRET must be set")
}

const cookieSession = createCookieSessionStorage({
  cookie: {
    name: "__session",
    secure: true,
    secrets: [sessionSecret],
    sameSite: "lax", // to help with CSRF
    path: "/",
    maxAge: 60 * 60 * 24 * 5, // 5 days
    httpOnly: true,
  },
})

// Authenticator

export interface AuthUser {
  idToken: string
  refreshToken: string
  email: string
  expiresIn: string
}

const authenticator = new Authenticator<AuthUser>(cookieSession)

export default authenticator

export enum AuthMethod {
  EmailPassword = "emailPassword",
}

// Auth helpers

const failureRedirect = "/login"
const successRedirect = "/admin"

export async function authenticateRoute(request: Request) {
  return authenticator.isAuthenticated(request, { failureRedirect })
}

export async function getAuthUser(request: Request) {
  return authenticator.isAuthenticated(request)
}

export async function loginUser(request: Request) {
  const user = await authenticator.authenticate(
    AuthMethod.EmailPassword,
    request,
    {
      throwOnError: true,
    },
  )
  const session = await cookieSession.getSession(request.headers.get("cookie"))
  session.set(authenticator.sessionKey, user)
  const headers = new Headers({
    "Set-Cookie": await cookieSession.commitSession(session),
  })

  return redirect(successRedirect, { headers })
}

// Auth method: emailPassword

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
  AuthMethod.EmailPassword,
)
