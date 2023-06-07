import { type DataFunctionArgs } from "@remix-run/server-runtime";

import { redirectToAbout } from "@gs/models/about.server";

export async function loader({ params }: DataFunctionArgs) {
  return redirectToAbout(params["*"]);
}

export function CatchBoundary() {}
