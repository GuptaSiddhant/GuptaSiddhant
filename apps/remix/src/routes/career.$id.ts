import { type LoaderFunction } from "@remix-run/server-runtime";

import { redirectToAbout } from "@gs/models/about/index.server";
// import { getCareerAssociatedProjects } from "@gs/models/career/index.server"

export const loader: LoaderFunction = async ({ params }) => {
  const id = params.id;

  // const associatedProjects = await getCareerAssociatedProjects(id || "")

  return redirectToAbout(id);
};

export function CatchBoundary() {}
