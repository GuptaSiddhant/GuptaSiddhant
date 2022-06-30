import { type LoaderFunction, redirect } from "@remix-run/server-runtime"

export const loader: LoaderFunction = ({ params }) => {
  const splat = params["*"]

  if (!splat) return redirect("/about", 301)

  return redirect(`/about/#${splat}`, 301)
}

export function CatchBoundary() {}
