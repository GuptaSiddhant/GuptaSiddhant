import type { Strategy } from "remix-auth";
import { Authenticator } from "remix-auth";
import { FormStrategy } from "remix-auth-form";

import { createCookieSessionStorage, redirect } from "@remix-run/node";

import parsedEnv from "@gs/env";
import { signInWithEmailPassword } from "@gs/firebase/auth";
import { UserRole } from "@gs/models/users";
import { type UserProps, getUser } from "@gs/models/users.server";
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
  ...userRoles: UserRole[]
): Promise<AuthUser> {
  return authenticate(request, ...userRoles).catch(() => {
    throw redirect(`${failureRedirect}?redirectTo=${request.url}`);
  });
}

export async function authenticate(request: Request, ...userRoles: UserRole[]) {
  const user = await authenticator.isAuthenticated(request);
  if (!user) {
    throw new Error("Unauthorised");
  }

  if (userRoles.length > 0) {
    if (userRoles.includes(UserRole.GUEST)) {
      userRoles.push(UserRole.EDITOR, UserRole.ADMIN);
    } else if (userRoles.includes(UserRole.EDITOR)) {
      userRoles.push(UserRole.ADMIN);
    }

    const hasAccess = await isUserHasAccess(user, ...userRoles);
    if (!hasAccess) {
      throw new Error("Access restricted");
    }
  }

  return user;
}

export async function getAuthUser(request: Request): Promise<UserProps | null> {
  const user = await authenticator.isAuthenticated(request);
  if (!user) {
    return null;
  }

  return await getUser(user.email);
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

  let role = UserRole.GUEST;
  if ("role" in user) {
    // rome-ignore lint/suspicious/noExplicitAny: '"role" in user' does not help
    role = (user as any).role;
  } else {
    const authUser = await getUser(user.email);
    role = authUser.role;
  }

  return roles.includes(role);
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

  const redirectTo = formData.get("redirectTo")?.toString() || successRedirect;

  return redirect(redirectTo, { headers });
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

  const userFromDatabase = await getUser(user.email);

  const authUser: AuthUser = {
    idToken: user.idToken,
    refreshToken: user.refreshToken,
    expiresIn: user.expiresIn,
    ...userFromDatabase,
    email: user.email,
  };

  return authUser;
}) as unknown as Strategy<AuthUser, never>;

authenticator.use(emailPasswordStrategy, AuthMethod.EmailPassword);
