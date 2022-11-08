import CodeIcon from "remixicon-react/FileCodeLineIcon";
import FileIcon from "remixicon-react/FileLineIcon";
import PdfIcon from "remixicon-react/FilePdfLineIcon";
import TextFileIcon from "remixicon-react/FileTextLineIcon";
import ZipIcon from "remixicon-react/FileZipLineIcon";
import FontIcon from "remixicon-react/FontSizeIcon";
import ImageIcon from "remixicon-react/ImageLineIcon";
import VideoIcon from "remixicon-react/VideoLineIcon";

import { type StorageFile } from "@gs/service/storage.server";

import { type AdminNavbarGroupProps } from "../layout/AdminNavbar";

export function generateNavbarGroupsFromStorageDirContents(
  dirs: string[],
  files: StorageFile[],
): AdminNavbarGroupProps[] {
  return [
    {
      id: "directories",
      label: "Directories",
      showCount: true,
      openByDefault: true,
      children: dirs.map((dir) => ({
        id: dir,
        children: extractLastPartOfFilePath(dir),
        to: dir,
      })),
    },
    {
      id: "files",
      label: "Files",
      showCount: true,
      openByDefault: true,
      children: files
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((file) => ({
          id: file.id,
          children: (
            <div className="flex gap-2">
              <span className="text-disabled">
                {getIconFromFileType(
                  getFileTypeFromFileContentType(file.contentType),
                )}
              </span>
              {extractLastPartOfFilePath(file.name)}
            </div>
          ),
          to: file.name,
        })),
    },
  ];
}

export function extractLastPartOfFilePath(path: string) {
  return path.split("/").filter(Boolean).slice(-1).join("/");
}

export function generatePathsFromPath(path: string, delimiter = "/"): string[] {
  const paths: string[] = [];
  const isAllDirectories = path.endsWith(delimiter);
  const pathParts = path.split(delimiter).filter(Boolean);

  pathParts.forEach((_, index, parts) => {
    const newOath = parts.slice(0, index + 1).join(delimiter);
    if (index < parts.length - 1 || isAllDirectories) {
      return paths.push(newOath + delimiter);
    }
    return paths.push(path);
  });

  return paths;
}

export enum FileType {
  Image = "image",
  Pdf = "pdf",
  Font = "font",
  Zip = "zip",
  Video = "video",
  Text = "text",
  Code = "code",
  Other = "other",
}

export function getFileTypeFromFileContentType(
  contentType: string,
): FileType | undefined {
  if (!contentType) {
    return undefined;
  }
  if (contentType.includes("image")) {
    return FileType.Image;
  }
  if (contentType.includes("pdf")) {
    return FileType.Pdf;
  }
  if (contentType.includes("font")) {
    return FileType.Font;
  }
  if (contentType.includes("zip")) {
    return FileType.Zip;
  }
  if (contentType.includes("video")) {
    return FileType.Video;
  }
  if (contentType.includes("text/plain")) {
    return FileType.Text;
  }
  if (contentType.includes("application")) {
    return FileType.Code;
  }

  return FileType.Other;
}

export function getIconFromFileType(type?: FileType): JSX.Element | null {
  switch (type) {
    case FileType.Image:
      return <ImageIcon />;
    case FileType.Pdf:
      return <PdfIcon />;
    case FileType.Font:
      return <FontIcon />;
    case FileType.Zip:
      return <ZipIcon />;
    case FileType.Video:
      return <VideoIcon />;
    case FileType.Text:
      return <TextFileIcon />;
    case FileType.Code:
      return <CodeIcon />;
    default:
      return <FileIcon />;
  }
}
