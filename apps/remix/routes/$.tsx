import { appLogger } from "@features/service/logger.server"
import { resolveStorageAssetUrl } from "@features/service/storage.server"
import { ErrorSection } from "@features/ui/Error"
import type { LoaderFunction } from "@remix-run/server-runtime"
import { json, redirect } from "@remix-run/server-runtime"

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
