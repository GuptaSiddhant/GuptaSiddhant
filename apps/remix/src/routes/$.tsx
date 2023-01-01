import type { LoaderFunction } from "@remix-run/server-runtime";
import { redirect } from "@remix-run/server-runtime";

import { ONE_DAY_IN_S } from "@gs/constants";
import { generateCloudinaryUrl } from "@gs/helpers/assets";
import { appLogger } from "@gs/service/logger.server";
import Storage from "@gs/service/storage.server";
import { getErrorMessage } from "@gs/utils/error";
import invariant from "@gs/utils/invariant";

export const loader: LoaderFunction = async ({ params, request }) => {
  const path = params["*"];
  const { searchParams } = new URL(request.url);

  let response: Response | void;

  try {
    invariant(path, "asset path is required");

    response = await redirectLoader(path);
    if (response) {
      return response;
    }

    response = await assetLoader(path, Object.fromEntries(searchParams));
    if (response) {
      return response;
    }

    throw new Error(`Error 404 Path not found - ${path}`);
  } catch (e) {
    appLogger.error(getErrorMessage(e));

    return redirect("/404");
  }
};

export function CatchBoundary() {}

async function redirectLoader(path: string): Promise<Response | void> {
  const editPath = "/edit";
  if (path.includes(editPath)) {
    const { pathname } = new URL(path);
    const pathnameWithoutEdit = pathname.replace(editPath, "");

    return redirect(`/admin/editor${pathnameWithoutEdit}`);
  }
}

async function assetLoader(
  path: string,
  params?: Record<string, string>,
): Promise<Response | void> {
  const assetOriginalExts = ["mp4", "webm", "ogg", "mp3", "wav", "flac"];
  const assetRedirectExts = [
    "png",
    "jpg",
    "jpeg",
    "gif",
    "webp",
    "avif",
    "heif",
    "heic",
    "jp2",
    "svg",
  ];
  const assetDownloadExts = ["pdf"];

  if (assetOriginalExts.some((ext) => path.endsWith(ext))) {
    const url = await Storage.queryAssetPublicUrl(path);
    invariant(url, `could not get url for asset: '${path}'`);

    return redirect(url);
  }

  if (assetRedirectExts.some((ext) => path.endsWith(ext))) {
    if (await Storage.queryAssetExists(path)) {
      return redirect(generateCloudinaryUrl(path, params), 301);
    }
  }

  if (assetDownloadExts.some((ext) => path.endsWith(ext))) {
    if (await Storage.queryAssetExists(path)) {
      const file = await Storage.downloadAsset(path);
      invariant(file, `could not get file for asset: '${path}'`);
      const ext = path.split(".").pop();

      return new Response(file, {
        status: 200,
        headers: {
          "Content-Type": `image/${ext}`,
          "Cache-Control": `max-age=${ONE_DAY_IN_S}`,
        },
      });
    }
  }
}
