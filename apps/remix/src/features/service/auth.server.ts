import { AuthenticateOptions, Authenticator, Strategy } from "remix-auth";
import { FormStrategy } from "remix-auth-form";

import {
  SessionData,
  SessionStorage,
  createCookieSessionStorage,
  redirect,
} from "@remix-run/node";

import parsedEnv from "@gs/env";
import { signInWithEmailPassword } from "@gs/firebase/auth";
import { UserRole } from "@gs/models/users.model";
import { type UserProps, getUserById } from "@gs/models/users.server";
import invariant from "@gs/utils/invariant";

// Auth Session

const cookieSession = createCookieSessionStorage({
  cookie: {
    name: "__session",
    secure: true,
    secrets: [parsedEnv.SESSION_SECRET],
    sameSite: "lax", // to help with CSRF
    path: "/",
    maxAge: 60 * 60 * 24 * 5, // 5 days
    httpOnly: true,
  },
});

// Authenticator

export interface AuthUser extends UserProps {
  idToken: string;
  refreshToken: string;
  email: string;
  expiresIn: string;
}

const authenticator = new Authenticator<AuthUser>(cookieSession);

export default authenticator;

export enum AuthMethod {
  EmailPassword = "emailPassword",
}

// Auth helpers

const failureRedirect = "/login";
const successRedirect = "/admin";

export async function authenticateRoute(
  request: Request,
  // At least one role is required so that routes never default to "any logged-in user".
  ...userRoles: [UserRole, ...UserRole[]]
): Promise<AuthUser> {
  return authenticate(request, ...userRoles).catch(() => {
    const { pathname, search } = new URL(request.url);
    throw redirect(
      `${failureRedirect}?redirectTo=${encodeURIComponent(pathname + search)}`,
    );
  });
}

export async function authenticate(
  request: Request,
  ...userRoles: [UserRole, ...UserRole[]]
) {
  const user = await authenticator.isAuthenticated(request);
  if (!user) {
    throw new Error("Unauthorised");
  }

  const allowedRoles = [...userRoles];
  if (allowedRoles.includes(UserRole.GUEST)) {
    allowedRoles.push(UserRole.EDITOR, UserRole.ADMIN);
  } else if (allowedRoles.includes(UserRole.EDITOR)) {
    allowedRoles.push(UserRole.ADMIN);
  }

  const hasAccess = await isUserHasAccess(user, ...allowedRoles);
  if (!hasAccess) {
    throw new Error("Access restricted");
  }

  return user;
}

export async function getAuthUser(request: Request) {
  const authUser = await authenticator.isAuthenticated(request);
  if (!authUser) {
    return null;
  }

  return getUserById(authUser.email).catch(() => null);
}

export async function isUserHasWriteAccess<T extends { email: string }>(
  user?: T | null,
) {
  return isUserHasAccess(user, UserRole.ADMIN, UserRole.EDITOR);
}

export async function isUserHasAdminAccess<T extends { email: string }>(
  user?: T | null,
) {
  return isUserHasAccess(user, UserRole.ADMIN);
}

export async function isUserHasAccess<T extends { email: string }>(
  user: T | null | undefined,
  ...roles: UserRole[]
) {
  if (!user) {
    return false;
  }

  // Always check the database: the session cookie may hold a stale role, and
  // an unknown user (not in the users collection) has no access.
  const dbUser = await getUserById(user.email).catch(() => null);
  if (!dbUser) {
    return false;
  }

  return roles.includes(dbUser.role);
}

/** Only allow same-origin relative paths to prevent open redirects. */
function getSafeRedirectPath(value: FormDataEntryValue | null): string {
  const path = value?.toString();
  if (
    path &&
    path.startsWith("/") &&
    !path.startsWith("//") &&
    !path.includes("\\")
  ) {
    return path;
  }
  return successRedirect;
}

export async function loginUser(request: Request) {
  const formData = await request.formData();

  const user = await authenticator.authenticate(
    AuthMethod.EmailPassword,
    request,
    { throwOnError: true, context: { formData } },
  );
  const session = await cookieSession.getSession(request.headers.get("cookie"));
  session.set(authenticator.sessionKey, user);
  const headers = new Headers({
    "Set-Cookie": await cookieSession.commitSession(session),
  });

  return redirect(getSafeRedirectPath(formData.get("redirectTo")), { headers });
}

// Auth method: emailPassword

const emailPasswordStrategy = new FormStrategy(async ({ form }) => {
  const email = form.get("email")?.toString();
  invariant(email, "email is required");

  const password = form.get("password")?.toString();
  invariant(password, "password is required");

  const user = await signInWithEmailPassword(email, password);
  if ("error" in user) {
    throw new Error(user.error.message);
  }

  const userFromDatabase = await getUserById(user.email);

  const authUser: AuthUser = {
    idToken: user.idToken,
    refreshToken: user.refreshToken,
    expiresIn: user.expiresIn,
    ...userFromDatabase,
    email: user.email,
  };

  return authUser;
});

authenticator.use(emailPasswordStrategy, AuthMethod.EmailPassword);
