import { type LoaderFunction } from "@remix-run/server-runtime"

import { redirectToAbout } from "@gs/models/about/index.server"

export const loader: LoaderFunction = ({ params }) => {
  return redirectToAbout(params["*"])
}

export function CatchBoundary() {}
