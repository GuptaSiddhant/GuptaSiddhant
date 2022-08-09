import { type LoaderFunction } from "@remix-run/server-runtime"

import { redirectToAbout } from "@gs/models/about.server"
// import { getEducationAssociatedProjects } from "@gs/models/education.server"

export const loader: LoaderFunction = async ({ params }) => {
  const id = params.id
  console.log({ id })

  // const associatedProjects = await getEducationAssociatedProjects(id || "")

  return redirectToAbout(id)
}

export function CatchBoundary() {}
