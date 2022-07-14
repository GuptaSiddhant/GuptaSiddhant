import AdminLayout from "@gs/admin/layout/AdminLayout"
import { DeleteIcon } from "@gs/icons"
import Action from "@gs/ui/Action"
import { getDeleteConfirmProps } from "@gs/ui/Popover/Confirm"
import FolderIcon from "remixicon-react/Folder3FillIcon"

import AdminDashboard from "../components/AdminDashboard"
import {
  extractLastPartOfFilePath,
  generateNavbarGroupsFromStorageDirContents,
} from "./helpers"
import StorageFileView from "./StorageFileView"
import { type StoragePathProps, StoragePathType } from "./types"

export default function StorageDirView({
  storagePaths = [],
  prevStoragePath,
}: {
  storagePaths: StoragePathProps[]
  prevStoragePath?: StoragePathProps
}): JSX.Element | null {
  if (storagePaths.length === 0)
    return <FolderInfo storagePath={prevStoragePath} />

  const [currentPath, ...subPaths] = storagePaths
  const name = extractLastPartOfFilePath(currentPath.path)

  if (currentPath.type === StoragePathType.File)
    return <StorageFileView key={currentPath.path} {...currentPath} />

  return (
    <AdminLayout
      title={name}
      to={currentPath.path}
      header={<span className="font-bold">{name}</span>}
      sectionClassName="w-max min-w-full"
      navGroups={generateNavbarGroupsFromStorageDirContents(
        currentPath.dirs,
        currentPath.files,
      )}
      actions={[
        {
          id: "Delete",
          children: (
            <Action
              method="delete"
              body={{ prefix: currentPath.path, type: "dir" }}
              title="Delete folder"
              confirm={getDeleteConfirmProps("folder")}
            >
              <DeleteIcon />
            </Action>
          ),
        },
      ]}
    >
      <StorageDirView storagePaths={subPaths} prevStoragePath={currentPath} />
    </AdminLayout>
  )
}

function FolderInfo({
  storagePath,
}: {
  storagePath?: StoragePathProps
}): JSX.Element | null {
  if (!storagePath || storagePath.type === StoragePathType.File) return null
  const name = extractLastPartOfFilePath(storagePath.path)

  return (
    <AdminDashboard icon={<FolderIcon />} title={name}>
      <AdminDashboard.Table
        data={[{ ...storagePath }]}
        columns={[
          {
            id: "dirs",
            header: "Directories",
            cell: (row) => row.dirs.length.toString(),
          },
          {
            id: "files",
            cell: (row) => row.files.length.toString(),
          },
        ]}
      />
    </AdminDashboard>
  )
}
