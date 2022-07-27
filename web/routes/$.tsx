import invariant from "tiny-invariant"

import type { LoaderFunction } from "@remix-run/server-runtime"
import { json, redirect } from "@remix-run/server-runtime"

import { appLogger } from "@gs/service/logger.server"
import storage from "@gs/service/storage.server"
import { ErrorSection } from "@gs/ui/Error"

export const loader: LoaderFunction = async ({ params }) => {
  const path = params["*"]

  try {
    const assetUrl = await resolveStorageAssetUrl(path)

    return redirect(assetUrl)
  } catch (e: any) {
    appLogger.error(e.message)

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

// Helpers

async function resolveStorageAssetUrl(path?: string) {
  invariant(path, "asset path is required")
  const assetExts = ["png", "jpg", "jpeg", "gif", "pdf", "mp4"]

  if (assetExts.some((ext) => path.endsWith(ext))) {
    const url = await storage.queryAssetPublicUrl(path)
    invariant(url, "could not get public url for asset: '" + path + "'")

    return url
  }

  throw new Error("Not an asset: '" + path + "'")
}
