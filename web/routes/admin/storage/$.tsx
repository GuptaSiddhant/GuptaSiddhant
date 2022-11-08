import { useLoaderData } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/server-runtime";
import { json, redirect } from "@remix-run/server-runtime";

import { AdminAppId, adminRegistry } from "@gs/admin";
import { generatePathsFromPath } from "@gs/admin/storage/helpers";
import { getStoragePaths } from "@gs/admin/storage/service.server";
import StorageDirView from "@gs/admin/storage/StorageDirView";
import { type StoragePathProps } from "@gs/admin/storage/types";
import { authenticateRoute } from "@gs/service/auth.server";

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

  return <StorageDirView storagePaths={storagePaths} />;
}
