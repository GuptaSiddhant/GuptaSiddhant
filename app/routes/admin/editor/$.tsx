import type { LoaderFunction } from "@remix-run/server-runtime"
import { redirect } from "@remix-run/server-runtime"

import { FirestoreCollection } from "~/features/service/firestore.server"
import { ErrorSection } from "~/features/ui/Error"

import { handle } from "../editor"

export const loader: LoaderFunction = async ({ params }) => {
  const path = params["*"]
  if (!path) return redirect(handle.adminApp.to)

  const [category] = path.split("/")

  if (
    !Object.values(FirestoreCollection).includes(
      category as FirestoreCollection,
    )
  )
    return redirect(handle.adminApp.to)

  return null
}

export default function Error404(): JSX.Element | null {
  return (
    <ErrorSection
      caption={"Error 404"}
      title="Editor id not found"
      message="Oops! Looks like you tried to visit an entry that does not exist."
    />
  )
}
