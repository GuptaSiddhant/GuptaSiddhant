import { useLoaderData } from "@remix-run/react"
import type { ActionFunction, LoaderFunction } from "@remix-run/server-runtime"
import { json } from "@remix-run/server-runtime"
import { redirect } from "@remix-run/server-runtime"
import invariant from "tiny-invariant"

import { authenticateRoute } from "~/features/service/auth.server"
import Database, { DatabaseModel } from "~/features/service/database.server"
import { ErrorSection } from "~/features/ui/Error"
import FormAction from "~/features/ui/FormAction"
import { Caption, Paragraph } from "~/features/ui/Text"

import { handle } from "../editor"

interface LoaderData {
  error: boolean
  collection?: string
}

export const loader: LoaderFunction = async ({ params, request }) => {
  await authenticateRoute(request)
  const path = params["*"]
  if (!path) return redirect(handle.adminApp.to)

  const [collection, id] = path.split("/")

  if (id) {
    return json<LoaderData>({ error: true })
  }

  if (!Object.values(DatabaseModel).includes(collection as DatabaseModel)) {
    return redirect(handle.adminApp.to)
  } else return json<LoaderData>({ error: false, collection })
}

export const action: ActionFunction = async ({ request }) => {
  await authenticateRoute(request)
  const { pathname } = new URL(request.url)
  const formData = await request.formData()
  const collection = formData.get("collection")?.toString()

  if (request.method === "PATCH") {
    invariant(collection, "collection is required")
    Database.clearCache(collection)
  }

  return redirect(pathname)
}

export default function Error404(): JSX.Element | null {
  const { error, collection } = useLoaderData<LoaderData>()

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
      <Caption>{collection}</Caption>
      <Paragraph className="text-disabled">
        Pick an entry from the sidebar.
      </Paragraph>
      <FormAction method="patch" body={{ collection }} title="Clear cache">
        Clear cache
      </FormAction>
    </div>
  )
}
