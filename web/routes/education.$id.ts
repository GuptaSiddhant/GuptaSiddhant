import { type LoaderFunction } from "@remix-run/server-runtime"

import { redirectToAbout } from "@gs/models/about/index.server"
// import { getEducationAssociatedProjects } from "@gs/models/education/index.server"

export const loader: LoaderFunction = async ({ params }) => {
  const id = params.id

  // const associatedProjects = await getEducationAssociatedProjects(id || "")

  return redirectToAbout(id)
}

export function CatchBoundary() {}
