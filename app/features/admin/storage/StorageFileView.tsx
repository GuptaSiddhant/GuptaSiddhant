import { Link } from "@remix-run/react"

import AdminLayout from "~/features/admin/AdminLayout"
import { formatDateTime, formatUnit } from "~/features/helpers/format"
import Accordion from "~/features/ui/Accordion"

import AdminDashboard from "../AdminDashboard"
import { extractLastPartOfFilePath } from "./helpers"
import { type StorageFileProps } from "./types"

export default function StorageFileView({
  path,
  data,
}: StorageFileProps): JSX.Element | null {
  const name = extractLastPartOfFilePath(path)
  const { linkUrl, contentType } = data

  const isImage = contentType.startsWith("image/")

  return (
    <AdminLayout
      name={name}
      header={<span className="font-bold">{name}</span>}
      className="flex flex-col gap-4"
    >
      <Accordion
        open
        summary="File data"
        summaryClassName="rounded-none sticky top-0"
      >
        <AdminDashboard.Table
          className="w-full"
          data={[data]}
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

      {isImage ? <StorageFileImageView src={linkUrl} alt={name} /> : null}
    </AdminLayout>
  )
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
      <Link to={src}>
        <img src={src} alt={alt} className="m-4" />
      </Link>
    </Accordion>
  )
}
