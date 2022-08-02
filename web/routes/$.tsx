import invariant from "tiny-invariant"

import type { LoaderFunction } from "@remix-run/server-runtime"
import { redirect } from "@remix-run/server-runtime"

import { ONE_DAY_IN_S } from "@gs/constants"
import { appLogger } from "@gs/service/logger.server"
import storage from "@gs/service/storage.server"

export const loader: LoaderFunction = async ({ params }) => {
  const path = params["*"]
  const assetDownloadExts = ["png", "jpg", "jpeg", "gif", "pdf", "webp", "avif"]
  const assetRedirectExts = ["mp4", "webm", "ogg", "mp3", "wav", "flac"]

  try {
    invariant(path, "asset path is required")

    if (assetRedirectExts.some((ext) => path.endsWith(ext))) {
      const url = await storage.queryAssetPublicUrl(path)
      invariant(url, "could not get url for asset: '" + path + "'")

      return redirect(url)
    }

    if (assetDownloadExts.some((ext) => path.endsWith(ext))) {
      if (await storage.queryAssetExists(path)) {
        const file = await storage.downloadAsset(path)
        invariant(file, "could not get file for asset: '" + path + "'")
        const ext = path.split(".").pop()

        return new Response(file, {
          status: 200,
          headers: {
            "Content-Type": `image/${ext}`,
            "Cache-Control": `max-age=${ONE_DAY_IN_S}`,
          },
        })
      }
    }

    throw new Error("Not an asset: '" + path + "'")
  } catch (e: any) {
    appLogger.error(e.message)

    return redirect("/404")
  }
}

export function CatchBoundary() {}
