import { useLoaderData } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/server-runtime";
import { json, redirect } from "@remix-run/server-runtime";

import { authenticateRoute } from "@gs/service/auth.server";

import { AdminAppId, adminRegistry } from "./features";
import StorageDirView from "./features/storage/StorageDirView";
import { generatePathsFromPath } from "./features/storage/helpers";
import { getStoragePaths } from "./features/storage/service.server";
import { type StoragePathProps } from "./features/storage/types";

const adminApp = adminRegistry.getApp(AdminAppId.Storage);

interface LoaderData {
  storagePaths: StoragePathProps[];
}

export const loader: LoaderFunction = async ({ params, request }) => {
  await authenticateRoute(request);
  const path = params["*"];

  if (!path) {
    return redirect(adminApp.linkPath);
  }

  const paths = generatePathsFromPath(path);
  try {
    const storagePaths = await getStoragePaths(paths);

    return json<LoaderData>({ storagePaths });
  } catch {
    const redirectRootPath = adminApp.linkPath;
    const redirectPath =
      paths.length >= 2 ? `/${paths[paths.length - 2]}` : undefined;

    return redirect(redirectRootPath + (redirectPath || ""));
  }
};

export default function StoragePath(): JSX.Element | null {
  const { storagePaths } = useLoaderData<LoaderData>();

  // @ts-expect-error
  return <StorageDirView storagePaths={storagePaths} />;
}
