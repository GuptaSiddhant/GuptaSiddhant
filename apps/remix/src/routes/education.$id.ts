import { type LoaderFunction } from "@remix-run/server-runtime";

import { redirectToAbout } from "@gs/models/about.server";

export const loader: LoaderFunction = async ({ params }) => {
  const id = params.id;

  return redirectToAbout(id);
};

export function CatchBoundary() {}
