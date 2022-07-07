import { useLoaderData } from "@remix-run/react"
import type { LoaderFunction } from "@remix-run/server-runtime"
import { json } from "@remix-run/server-runtime"
import { redirect } from "@remix-run/server-runtime"

import { FirestoreCollection } from "~/features/service/firestore.server"
import { ErrorSection } from "~/features/ui/Error"
import { Caption, Paragraph } from "~/features/ui/Text"

import { handle } from "../editor"

interface LoaderData {
  error: boolean
  category?: string
}

export const loader: LoaderFunction = async ({ params }) => {
  const path = params["*"]
  if (!path) return redirect(handle.adminApp.to)

  const [category, id] = path.split("/")

  if (id) {
    return json<LoaderData>({ error: true })
  }

  if (
    !Object.values(FirestoreCollection).includes(
      category as FirestoreCollection,
    )
  ) {
    return redirect(handle.adminApp.to)
  } else return json<LoaderData>({ error: false, category })
}

export default function Error404(): JSX.Element | null {
  const { error, category } = useLoaderData<LoaderData>()

  if (error)
    return (
      <ErrorSection
        caption={"Error 404"}
        title="Editor id not found"
        message="Oops! Looks like you tried to visit an entry that does not exist."
      />
    )

  return (
    <div className="h-full flex-col gap-4 flex-center">
      <Caption>{category}</Caption>
      <Paragraph className="text-disabled">
        Pick an entry from the sidebar.
      </Paragraph>
    </div>
  )
}
