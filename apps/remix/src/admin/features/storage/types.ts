import type { StorageFile } from "@gs/service/storage.server";

export enum StoragePathType {
  Dir = "dir",
  File = "file",
}

export type StoragePathProps = StorageDirProps | StorageFileProps;

export interface StorageDirProps {
  path: string;
  type: StoragePathType.Dir;
  dirs: string[];
  files: StorageFile[];
}
export interface StorageFileProps {
  path: string;
  type: StoragePathType.File;
  data: StorageFile;
}
