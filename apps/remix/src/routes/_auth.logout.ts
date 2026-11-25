import { type ActionFunctionArgs, type LoaderFunctionArgs } from "react-router";

import authenticator from "@gs/service/auth.server";

export async function loader({ request }: LoaderFunctionArgs) {
  return authenticator.logout(request, { redirectTo: "/" });
}

export async function action({ request }: ActionFunctionArgs) {
  return authenticator.logout(request, { redirectTo: "/login" });
}

export function CatchBoundary() {}
