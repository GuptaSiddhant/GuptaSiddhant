import type { SessionStorage } from "@remix-run/server-runtime"
import type { AuthenticateOptions, Strategy } from "remix-auth"

export enum WebAuthNType {
  RequestRegister = "request-register",
  Register = "register",
  Login = "login",
  LoginChallenge = "login-challenge",
}

export async function generateWebAuthNRequest(
  type: WebAuthNType,
  body: {} | string,
) {
  const searchParams = new URLSearchParams({ type })

  return fetch(`/webauthn?${searchParams.toString()}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: typeof body === "string" ? body : JSON.stringify(body),
  }).then((response) => response.json())
}

// export interface WebAuthNStrategyVerifyCallback<User> {
//   (email: string, password: string): Promise<User>
// }

// export interface WebAuthNStrategyVerifyParams {
//   /**
//    * A FormData object with the content of the form used to trigger the
//    * authentication.
//    *
//    * Here you can read any input value using the FormData API.
//    */
//   form: FormData
// }

// export class WebAuthNStrategy<User>
//   implements Strategy<User, WebAuthNStrategyVerifyParams>
// {
//   name = "webauthn"

//   constructor(private verify: WebAuthNStrategyVerifyCallback<User>) {}

//   async authenticate(
//     request: Request,
//     sessionStorage: SessionStorage,
//     options: AuthenticateOptions,
//   ): Promise<User> {}
// }
