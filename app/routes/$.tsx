import type { LoaderFunction } from "@remix-run/server-runtime"
import { json, redirect } from "@remix-run/server-runtime"
import invariant from "tiny-invariant"

import {
  checkFirebaseStorageFileExists,
  getFirebaseStorageFileUrl,
} from "~/features/service/storage.server"
import { ErrorSection } from "~/features/ui/Error"

export const loader: LoaderFunction = async ({ params }) => {
  const assetExts = ["png", "jpg", "jpeg", "gif", "pdf"]

  try {
    const path = params["*"]
    invariant(path, "asset path is required")

    if (
      assetExts.some((ext) => path.endsWith(ext)) &&
      (await checkFirebaseStorageFileExists(path))
    ) {
      const url = await getFirebaseStorageFileUrl(path)
      invariant(url, "could not get url")

      return redirect(url)
    }

    throw new Error("Not an asset")
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
