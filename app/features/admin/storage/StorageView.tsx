import AdminLayout from "~/features/admin/AdminLayout"
import { type FirebaseStorageFile } from "~/features/service/storage.server"

import {
  extractLastPartOfFilePath,
  generateNavbarGroupsFromFirebaseStorageDirsFiles,
} from "./helpers"

export enum StoragePathType {
  Dir = "dir",
  File = "file",
}

export interface StoragePathProps {
  path: string
  type: StoragePathType
  dirs: string[]
  files: FirebaseStorageFile[]
}

export default function StorageView({
  storagePaths = [],
}: {
  storagePaths: StoragePathProps[]
}): JSX.Element | null {
  if (storagePaths.length === 0) return null

  const [currentPath, ...subPaths] = storagePaths
  const name = extractLastPartOfFilePath(currentPath.path)

  if (currentPath.type === "file") {
    return <FileView {...currentPath} />
  }

  return (
    <AdminLayout
      name={name}
      header={<span className="font-bold">{name}</span>}
      navGroups={generateNavbarGroupsFromFirebaseStorageDirsFiles(
        currentPath.dirs,
        currentPath.files,
      )}
    >
      <StorageView storagePaths={subPaths} />
    </AdminLayout>
  )
}

function FileView({ path }: StoragePathProps): JSX.Element | null {
  const name = extractLastPartOfFilePath(path)

  return (
    <AdminLayout
      name={name}
      header={<span className="font-bold">{name}</span>}
      className="p-4"
    >
      <img src={"/" + path} alt={name} />
    </AdminLayout>
  )
}
