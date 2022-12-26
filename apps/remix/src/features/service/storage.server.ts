import {
  type FirebaseStorageFile,
  downloadFileFromFirebaseStorage,
  mutateFirebaseStorageDir,
  mutateFirebaseStorageFile,
  queryFirebaseStorageDirContents,
  queryFirebaseStorageFile,
  queryFirebaseStorageFileExists,
  queryFirebaseStorageFileSignedUrl,
  queryFirebaseStorageMetaData,
} from "@gs/firebase/storage";

import {
  deleteCachedKey,
  deleteCachedKeysWith,
  fetchCachedKey,
} from "./cache.server";

const cacheKey = "storage";

export type StorageDir = {
  dirs: string[];
  files: StorageFile[];
};
export type StorageFile = {
  id: string;
  name: string;
  contentType: string;
  size: number;
  createTimestamp: string;
  updateTimestamp: string;
  linkUrl: string;
};
export type StorageMetadata = Awaited<ReturnType<typeof Storage.queryMetadata>>;

export default class Storage {
  static #createCacheKey = (path: string) =>
    [cacheKey, path].filter(Boolean).join("/");

  static queryMetadata = async () => queryFirebaseStorageMetaData();

  static invalidateCacheByPath = (path: string) =>
    deleteCachedKey(this.#createCacheKey(path));

  static invalidateCacheAll = (path?: string) =>
    deleteCachedKeysWith(path ? this.#createCacheKey(path) : cacheKey);

  // Queries

  static queryAssetExists = async (path: string): Promise<boolean> =>
    fetchCachedKey(this.#createCacheKey(path), () =>
      queryFirebaseStorageFileExists(path),
    );

  static queryAssetPublicUrl = async (
    path: string,
  ): Promise<string | undefined> =>
    fetchCachedKey(this.#createCacheKey(path), async () => {
      if (await this.queryAssetExists(path)) {
        return queryFirebaseStorageFileSignedUrl(path);
      }
      return undefined;
    });

  static queryAsset = async (path: string): Promise<StorageFile> => {
    const file = await queryFirebaseStorageFile(path);

    return transformFromFirebaseStorageFile(file, path);
  };

  static downloadAsset = async (path: string): Promise<File> =>
    downloadFileFromFirebaseStorage(path);

  static queryDir = async (path?: string): Promise<StorageDir> =>
    queryFirebaseStorageDirContents(path).then((contents) => ({
      ...contents,
      files: contents.files.map((file) =>
        transformFromFirebaseStorageFile(file, path),
      ),
    }));
  // Mutations

  static mutateAsset = async (filePath: string, file?: string | File) =>
    mutateFirebaseStorageFile(filePath, file).then((res) => {
      this.invalidateCacheByPath(filePath);
      if (typeof res === "boolean") {
        return res;
      }
      return transformFromFirebaseStorageFile(res, filePath);
    });

  static mutateDir = async (dirPath?: string, files?: Array<string | File>) =>
    mutateFirebaseStorageDir(dirPath, files).then((resList) => {
      this.invalidateCacheAll(dirPath);
      return resList.map((res) => {
        if (typeof res === "boolean") {
          return res;
        }
        return transformFromFirebaseStorageFile(res);
      });
    });
}

// Helpers

function transformFromFirebaseStorageFile(
  file: FirebaseStorageFile,
  url?: string,
): StorageFile {
  return {
    id: file.id || file.metadata.id,
    name: file.metadata.name,
    contentType: file.metadata.contentType,
    size: Number.parseInt(file.metadata.size, 10),
    createTimestamp: file.metadata.timeCreated,
    updateTimestamp: file.metadata.updated,
    linkUrl: url || `/${file.metadata.name}`,
  };
}
