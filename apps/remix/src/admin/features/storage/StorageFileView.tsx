import clsx from "clsx";

import useWindowStore from "@gs/hooks/useWindowStore";
import { DeleteIcon, DownloadIcon, RenameIcon } from "@gs/icons";
import useRootContext from "@gs/root/RootContext";
import { type StorageFile } from "@gs/service/storage.server";
import Accordion from "@gs/ui/Accordion";
import Action from "@gs/ui/Action";
import Popover from "@gs/ui/Popover";
import { getDeleteConfirmProps } from "@gs/ui/Popover/Confirm";
import PopoverRenameContent from "@gs/ui/Popover/Rename";
import { formatDateTime, formatUnit } from "@gs/utils/format";

import AdminDashboard from "../components/AdminDashboard";
import AdminLayout from "../layout";
import {
  FileType,
  extractLastPartOfFilePath,
  getFileTypeFromFileContentType,
  getIconFromFileType,
} from "./helpers";
import { type StorageFileProps } from "./types";

export type StorageFileViewProps = StorageFileProps;

export default function StorageFileView({
  path,
  data,
}: StorageFileViewProps): JSX.Element | null {
  const name = extractLastPartOfFilePath(path);
  const type = getFileTypeFromFileContentType(data.contentType);
  const icon = getIconFromFileType(type);

  return (
    <AdminLayout
      title={name}
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
            <Action
              method="DELETE"
              body={{ path }}
              title="Delete file"
              confirm={getDeleteConfirmProps("file")}
            >
              <DeleteIcon />
            </Action>
          ),
        },
      ]}
    >
      <StorageFileDataView {...data} />
      <StorageFilePreview {...data} />
    </AdminLayout>
  );
}

function StorageFileDataView(file: StorageFile): JSX.Element {
  const { locale } = useRootContext();

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
            cell: (row) => formatDateTime(row.createTimestamp, { locale }),
          },
          {
            id: "updateTimestamp",
            header: "Updated at",
            cell: (row) => formatDateTime(row.updateTimestamp, { locale }),
          },
        ]}
      />
    </Accordion>
  );
}

function StorageFilePreview(file: StorageFile): JSX.Element | null {
  const { linkUrl, contentType, name } = file;
  const type = getFileTypeFromFileContentType(contentType);
  const originUrl = useWindowStore(
    "load",
    () => window.location.origin,
    () => "http://localhost",
  );

  if (!type) {
    return null;
  }

  const embedUrl = new URL(linkUrl, originUrl).toString();

  return (
    <Accordion
      open
      summary="Preview"
      summaryClassName="rounded-none sticky top-0"
    >
      <embed
        src={embedUrl}
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
  );
}
