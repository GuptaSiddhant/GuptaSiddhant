import { type LoaderFunctionArgs } from "react-router";

import { redirectToAbout } from "@gs/models/about.server";

export async function loader({ params }: LoaderFunctionArgs) {
  return redirectToAbout(params["*"]);
}

export function CatchBoundary() {}
