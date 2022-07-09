import { DeleteIcon } from "@gs/icons"
import FolderIcon from "remixicon-react/Folder3FillIcon"

import AdminLayout from "~/features/admin/layout/AdminLayout"
import FormAction from "~/features/ui/FormAction"
import { getDeleteConfirmProps } from "~/features/ui/Popover/Confirm"

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
      name={name}
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
            <FormAction
              method="delete"
              body={{ prefix: currentPath.path, type: "dir" }}
              title="Delete file"
              confirm={getDeleteConfirmProps("folder")}
            >
              <DeleteIcon />
            </FormAction>
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
    <AdminDashboard icon={<FolderIcon />} name={name}>
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
