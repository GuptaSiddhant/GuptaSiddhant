import { type LoaderFunctionArgs } from "react-router";

import { redirectToAbout } from "@gs/models/about.server";

export async function loader({ params }: LoaderFunctionArgs) {
  const id = params.id;

  return redirectToAbout(id);
}

export function CatchBoundary() {}
