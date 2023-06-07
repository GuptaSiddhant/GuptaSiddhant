import type { DataFunctionArgs } from "@remix-run/server-runtime";

import authenticator from "@gs/service/auth.server";

export async function loader({ request }: DataFunctionArgs) {
  return authenticator.logout(request, { redirectTo: "/" });
}

export async function action({ request }: DataFunctionArgs) {
  return authenticator.logout(request, { redirectTo: "/login" });
}

export function CatchBoundary() {}
