import {
  type LoaderFunctionArgs,
  data,
  redirect,
  useLoaderData,
} from "react-router";

import { authenticateRoute } from "@gs/service/auth.server";
import { UserRole } from "@gs/models/users.model";

import { AdminAppId, adminRegistry } from "./features";
import StorageDirView from "./features/storage/StorageDirView";
import { generatePathsFromPath } from "./features/storage/helpers";
import { getStoragePaths } from "./features/storage/service.server";
import { type StoragePathProps } from "./features/storage/types";

const adminApp = adminRegistry.getApp(AdminAppId.Storage);

interface LoaderData {
  storagePaths: StoragePathProps[];
}

export async function loader({ params, request }: LoaderFunctionArgs) {
  await authenticateRoute(request, UserRole.EDITOR);
  const path = params["*"];

  if (!path) {
    return redirect(adminApp.linkPath);
  }

  const paths = generatePathsFromPath(path);
  try {
    const storagePaths = await getStoragePaths(paths);

    return data<LoaderData>({ storagePaths });
  } catch {
    const redirectRootPath = adminApp.linkPath;
    const redirectPath =
      paths.length >= 2 ? `/${paths[paths.length - 2]}` : undefined;

    return redirect(redirectRootPath + (redirectPath || ""));
  }
}

export default function StoragePath(): JSX.Element | null {
  const { storagePaths } = useLoaderData<LoaderData>();

  return <StorageDirView storagePaths={storagePaths} />;
}
