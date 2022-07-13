import authenticator from "@features/service/auth.server"
import type { ActionFunction, LoaderFunction } from "@remix-run/server-runtime"

export const loader: LoaderFunction = async ({ request }) => {
  return authenticator.logout(request, { redirectTo: "/" })
}

export const action: ActionFunction = async ({ request }) => {
  return authenticator.logout(request, { redirectTo: "/login" })
}
