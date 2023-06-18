import { SessionData, SessionStorage } from "@remix-run/node";
import { AuthenticateOptions, Strategy } from "remix-auth";

export default class AnonymousStrategy<User> extends Strategy<User, void> {
  name = "anonymous";

  async authenticate(
    request: Request,
    sessionStorage: SessionStorage<SessionData, SessionData>,
    options: AuthenticateOptions,
  ): Promise<User> {
    try {
      const user = await this.verify();
      return this.success(user, request, sessionStorage, options);
    } catch (error) {
      if (error instanceof Error) {
        return await this.failure(
          error.message,
          request,
          sessionStorage,
          options,
          error,
        );
      }

      if (typeof error === "string") {
        return await this.failure(
          error,
          request,
          sessionStorage,
          options,
          new Error(error),
        );
      }

      return await this.failure(
        "Unknown error",
        request,
        sessionStorage,
        options,
        new Error(JSON.stringify(error, null, 2)),
      );
    }
  }
}

// if ("error" in user) {
//     throw new Error(user.error.message);
// }

// if (successRedirect) throw redirect(successRedirect);
// return {
//   id: user.localId,
//   name: "Anonymous",
//   role: UserRole.GUEST,
//   email: user.email,
//   idToken: user.idToken,
//   refreshToken: user.refreshToken,
//   expiresIn: user.expiresIn,
// };
