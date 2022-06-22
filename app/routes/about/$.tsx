import { type LoaderFunction, redirect } from "@remix-run/server-runtime"

export const loader: LoaderFunction = ({ params }) => {
  const splat = params["*"]

  if (!splat) return redirect("/about")

  return redirect(`/about/#${splat}`)
}
