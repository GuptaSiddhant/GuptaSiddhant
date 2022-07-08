import clsx from "clsx"

import AdminLayout from "~/features/admin/AdminLayout"
import { formatDateTime, formatUnit } from "~/features/helpers/format"
import { DeleteIcon, DownloadIcon, RenameIcon } from "@gs/icons"
import { type FirebaseStorageFile } from "~/features/service/firebase-storage.server"
import Accordion from "~/features/ui/Accordion"
import FormAction from "~/features/ui/FormAction"
import Popover from "~/features/ui/Popover"
import { getDeleteConfirmProps } from "~/features/ui/Popover/Confirm"
import PopoverRenameContent from "~/features/ui/Popover/Rename"

import AdminDashboard from "../AdminDashboard"
import {
  extractLastPartOfFilePath,
  FileType,
  getFileTypeFromFileContentType,
  getIconFromFileType,
} from "./helpers"
import { type StorageFileProps } from "./types"

export default function StorageFileView({
  path,
  data,
}: StorageFileProps): JSX.Element | null {
  const name = extractLastPartOfFilePath(path)
  const type = getFileTypeFromFileContentType(data.contentType)
  const icon = getIconFromFileType(type)

  return (
    <AdminLayout
      name={name}
      to={path}
      header={
        <span className="flex items-center gap-2 font-bold">
          {icon} {name}
        </span>
      }
      className="flex flex-col gap-4"
      actions={[
        {
          id: "Download",
          children: <DownloadIcon />,
          to: data.linkUrl,
          download: name,
        },
        {
          id: "Rename",
          children: (
            <Popover
              title="Rename"
              content={<PopoverRenameContent previousName={path} />}
            >
              <RenameIcon />
            </Popover>
          ),
        },
        {
          id: "Delete",
          children: (
            <FormAction
              method="delete"
              body={{ path }}
              title="Delete file"
              confirm={getDeleteConfirmProps("file")}
            >
              <DeleteIcon />
            </FormAction>
          ),
        },
      ]}
    >
      <StorageFileDataView {...data} />
      <StorageFilePreview {...data} />
    </AdminLayout>
  )
}

function StorageFileDataView(file: FirebaseStorageFile): JSX.Element {
  return (
    <Accordion
      open
      summary="File data"
      summaryClassName="rounded-none sticky top-0"
    >
      <AdminDashboard.Table
        className="w-full"
        data={[file]}
        columns={[
          {
            id: "contentType",
            header: "Type",
            cell: (row) => row.contentType || "Unknown",
          },
          {
            id: "size",
            cell: (row) => formatUnit(row.size / 1000, "kilobyte"),
          },
          {
            id: "createTimestamp",
            header: "Created at",
            cell: (row) => formatDateTime(row.createTimestamp),
          },
          {
            id: "updateTimestamp",
            header: "Updated at",
            cell: (row) => formatDateTime(row.updateTimestamp),
          },
        ]}
      />
    </Accordion>
  )
}

function StorageFilePreview(file: FirebaseStorageFile): JSX.Element | null {
  const { linkUrl, contentType, name } = file
  const type = getFileTypeFromFileContentType(contentType)

  if (!type) return null

  return (
    <Accordion
      open
      summary="Preview"
      summaryClassName="rounded-none sticky top-0"
    >
      <embed
        src={linkUrl}
        type={contentType}
        title={name}
        className={clsx(
          "max-w-lg object-contain",
          type === FileType.Video && "aspect-video w-full",
          [FileType.Pdf, FileType.Text, FileType.Code].includes(type) &&
            "aspect-[2/3] w-full",
        )}
      />
    </Accordion>
  )
}
