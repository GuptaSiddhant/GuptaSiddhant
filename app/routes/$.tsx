import type { LoaderFunction } from "@remix-run/server-runtime"
import { json, redirect } from "@remix-run/server-runtime"
import invariant from "tiny-invariant"

import { getFirebaseStorageFileUrl } from "~/features/service/storage.server"
import { ErrorSection } from "~/features/ui/Error"

export const loader: LoaderFunction = async ({ params }) => {
  const assetExts = ["png", "jpg", "jpeg", "gif", "pdf"]

  try {
    const path = params["*"]
    invariant(path, "path is required")

    if (assetExts.some((ext) => path.endsWith(ext))) {
      const url = await getFirebaseStorageFileUrl(path)
      invariant(url, "could not get url")

      const res = await fetch(url)
      invariant(res.status < 400, "not available")

      return redirect(url)
    } else {
      throw new Error("Not an asset")
    }
  } catch {
    return json(null)
  }
}

export function CatchBoundary() {}

export default function Error404(): JSX.Element | null {
  return (
    <ErrorSection
      caption={"Error 404"}
      title="Page not found"
      message="Oops! Looks like you tried to visit a page that does not exist."
    />
  )
}
