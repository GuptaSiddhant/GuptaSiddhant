import AdminLayout from "~/features/admin/AdminLayout"

import {
  extractLastPartOfFilePath,
  generateNavbarGroupsFromFirebaseStorageDirsFiles,
} from "./helpers"
import StorageFileView from "./StorageFileView"
import { type StoragePathProps, StoragePathType } from "./types"

export default function StorageDirView({
  storagePaths = [],
}: {
  storagePaths: StoragePathProps[]
}): JSX.Element | null {
  if (storagePaths.length === 0) return null

  const [currentPath, ...subPaths] = storagePaths
  const name = extractLastPartOfFilePath(currentPath.path)

  if (currentPath.type === StoragePathType.File)
    return <StorageFileView key={currentPath.path} {...currentPath} />

  return (
    <AdminLayout
      name={name}
      to={currentPath.path}
      header={<span className="font-bold">{name}</span>}
      navGroups={generateNavbarGroupsFromFirebaseStorageDirsFiles(
        currentPath.dirs,
        currentPath.files,
      )}
    >
      <StorageDirView storagePaths={subPaths} />
    </AdminLayout>
  )
}
