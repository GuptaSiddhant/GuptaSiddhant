import { Link } from "@remix-run/react"

import AdminLayout from "~/features/admin/AdminLayout"
import { formatDateTime, formatUnit } from "~/features/helpers/format"
import { DeleteIcon, DownloadIcon } from "~/features/icons"
import { type FirebaseStorageFile } from "~/features/service/storage.server"
import Accordion from "~/features/ui/Accordion"
import FormAction from "~/features/ui/FormAction"
import { getDeleteConfirmProps } from "~/features/ui/Popover/Confirm"

import AdminDashboard from "../AdminDashboard"
import { extractLastPartOfFilePath } from "./helpers"
import { type StorageFileProps } from "./types"

export default function StorageFileView({
  path,
  data,
}: StorageFileProps): JSX.Element | null {
  const name = extractLastPartOfFilePath(path)

  return (
    <AdminLayout
      name={name}
      to={path}
      header={<span className="font-bold">{name}</span>}
      className="flex flex-col gap-4"
      actions={[
        {
          id: "Download",
          children: <DownloadIcon />,
          to: data.linkUrl,
          download: name,
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
          { id: "contentType" },
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
  const isImage = Boolean(contentType?.startsWith("image"))

  if (isImage) return <StorageFileImageView src={linkUrl} alt={name} />

  return null
}

function StorageFileImageView({
  src,
  alt,
}: {
  src: string
  alt: string
}): JSX.Element | null {
  return (
    <Accordion
      open
      summary="Preview"
      summaryClassName="rounded-none sticky top-0"
    >
      <div className="flex justify-center">
        <Link to={src}>
          <img src={src} alt={alt} />
        </Link>
      </div>
    </Accordion>
  )
}
