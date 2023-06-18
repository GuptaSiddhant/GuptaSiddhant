import { AuthenticateOptions, Authenticator, Strategy } from "remix-auth";
import { FormStrategy } from "remix-auth-form";

import {
  SessionData,
  SessionStorage,
  createCookieSessionStorage,
  redirect,
} from "@remix-run/node";

import AnonymousStrategy from "./remix-auth-anonymous.server";
import parsedEnv from "@gs/env";
import { signInWithEmailPassword, signUpAnonymously } from "@gs/firebase/auth";
import { UserRole } from "@gs/models/users.model";
import { type UserProps, getUserById } from "@gs/models/users.server";
import { getErrorMessage } from "@gs/utils/error";
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
  Anonymous = "anonymous",
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

export async function getAuthUser(request: Request) {
  const authUser = await authenticator.isAuthenticated(request);
  if (!authUser) {
    return null;
  }

  return getUserById(authUser.email);
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
    const authUser = await getUserById(user.email);
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

export async function signUpAnonymousUser(request: Request) {
  if (await authenticator.isAuthenticated(request)) {
    console.log("---- isAuthenticated");
    return;
  }
  console.log("---- signUpAnonymousUser");
  const user = await authenticator.authenticate(AuthMethod.Anonymous, request, {
    throwOnError: true,
  });
  console.log(user);
  const session = await cookieSession.getSession(request.headers.get("cookie"));
  session.set(authenticator.sessionKey, user);
  const headers = new Headers({
    "Set-Cookie": await cookieSession.commitSession(session),
  });
  console.dir(headers);
  return redirect(request.url, { headers });
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

// Auth method: anonymous

const anonymousStrategy = new AnonymousStrategy(async () => {
  const user = await signUpAnonymously();
  if ("error" in user) {
    throw new Error(user.error.message);
  }

  const authUser: AuthUser = {
    id: user.localId,
    name: "Anonymous",
    role: UserRole.GUEST,
    email: user.email,
    idToken: user.idToken,
    refreshToken: user.refreshToken,
    expiresIn: user.expiresIn,
  };
  return authUser;
});

authenticator.use(anonymousStrategy, AuthMethod.Anonymous);
