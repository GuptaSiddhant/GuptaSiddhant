import Storage from "@gs/service/storage.server";
import invariant from "@gs/utils/invariant";
import { typedBooleanFilterPredicate } from "@gs/utils/predicates";

import { createAdminLogger } from "../logger.server";
import { generatePathsFromPath } from "./helpers";
import {
  type StorageDirProps,
  type StorageFileProps,
  type StoragePathProps,
  StoragePathType,
} from "./types";

const storageLogger = createAdminLogger("Storage");

export async function getStoragePaths(
  paths: string[],
): Promise<StoragePathProps[]> {
  const res = await Promise.allSettled(
    paths.map(async (path) => {
      if (path.endsWith("/")) {
        const dirProps: StorageDirProps = {
          type: StoragePathType.Dir,
          ...(await Storage.queryDir(path)),
          path,
        };

        return dirProps;
      }

      const fileProps: StorageFileProps = {
        type: StoragePathType.File,
        path,
        data: await Storage.queryAsset(path),
      };

      return fileProps;
    }),
  );

  return res
    .map((res) => (res.status === "fulfilled" ? res.value : undefined))
    .filter(typedBooleanFilterPredicate);
}

export async function modifyStorage(
  method: string,
  form: FormData,
  basePath = "/admin/storage",
): Promise<string | undefined> {
  if (method === "DELETE") {
    const type = form.get("type")?.toString();

    if (type === "dir") {
      const prefix = form.get("prefix")?.toString();
      invariant(prefix, "Dir prefix is required.");

      storageLogger.info(`Deleting dir "${prefix}".`);
      await Storage.mutateDir(prefix);

      return generateRedirectUrl(
        basePath,
        generatePathsFromPath(prefix).at(-2),
      );
    }

    const path = form.get("path")?.toString();
    invariant(path, "Asset path is required.");

    storageLogger.info(`Deleting asset "${path}".`);
    await Storage.mutateAsset(path);

    return generateRedirectUrl(basePath, generatePathsFromPath(path).at(-2));
  }

  if (method === "POST") {
    const files = form.getAll("files") as File[];
    invariant(files, "File path is required.");

    const destination = form.get("destination")?.toString();

    storageLogger.info(`Creating asset(s) "${destination}".`);
    const [firstUploadedFile] = await Storage.mutateDir(destination, files);

    const uploadedFileLink =
      typeof firstUploadedFile === "boolean"
        ? undefined
        : firstUploadedFile?.linkUrl;

    return uploadedFileLink
      ? generateRedirectUrl(basePath, uploadedFileLink)
      : undefined;
  }

  if (method === "PATCH") {
    const previousName = form.get("previousName")?.toString();
    invariant(previousName, "Asset previousName is required.");
    const name = form.get("name")?.toString();
    invariant(name, "Asset new name is required.");

    storageLogger.info(`Renaming asset "${previousName}" to "${name}".`);
    await Storage.mutateAsset(previousName, name);

    return generateRedirectUrl(basePath, name);
  }

  return;
}

function generateRedirectUrl(basePath: string, path?: string) {
  if (!path) {
    return `${basePath}/`;
  }
  if (path.startsWith("/")) {
    return `${basePath}${path}`;
  }
  return `${basePath}/${path}`;
}
