import { type DataFunctionArgs } from "@remix-run/server-runtime";

import { redirectToAbout } from "@gs/models/about.server";

export async function loader({ params }: DataFunctionArgs) {
  const id = params.id;

  return redirectToAbout(id);
}

export function CatchBoundary() {}
