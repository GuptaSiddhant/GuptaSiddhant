import CodeIcon from "remixicon-react/FileCodeLineIcon"
import FileIcon from "remixicon-react/FileLineIcon"
import PdfIcon from "remixicon-react/FilePdfLineIcon"
import TextFileIcon from "remixicon-react/FileTextLineIcon"
import ZipIcon from "remixicon-react/FileZipLineIcon"
import FontIcon from "remixicon-react/FontSizeIcon"
import ImageIcon from "remixicon-react/ImageLineIcon"
import VideoIcon from "remixicon-react/VideoLineIcon"

import { type FirebaseStorageFile } from "~/features/service/storage.server"

import { type AdminNavbarGroupProps } from "../AdminNavbar"

export function generateNavbarGroupsFromFirebaseStorageDirsFiles(
  dirs: string[],
  files: FirebaseStorageFile[],
): AdminNavbarGroupProps[] {
  return [
    {
      id: "directories",
      label: "Directories",
      showCount: true,
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
      children: files
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((file) => ({
          id: file.id,
          children: (
            <div className="flex gap-2">
              <span className="text-disabled">{getIconForFile(file)}</span>
              {extractLastPartOfFilePath(file.name)}
            </div>
          ),
          to: file.name,
        })),
    },
  ]
}

export function extractLastPartOfFilePath(path: string) {
  return path.split("/").filter(Boolean).slice(-1).join("/")
}

export function generatePathsFromPath(path: string, delimiter = "/"): string[] {
  const paths: string[] = []
  const isAllDirectories = path.endsWith(delimiter)
  const pathParts = path.split(delimiter).filter(Boolean)

  pathParts.forEach((_, index, parts) => {
    const newOath = parts.slice(0, index + 1).join(delimiter)
    if (index < parts.length - 1 || isAllDirectories) {
      return paths.push(newOath + delimiter)
    }
    return paths.push(path)
  })

  return paths
}

export function getIconForFile(file: FirebaseStorageFile): JSX.Element | null {
  if (file.contentType.includes("image")) return <ImageIcon />
  if (file.contentType.includes("pdf")) return <PdfIcon />
  if (file.contentType.includes("font")) return <FontIcon />
  if (file.contentType.includes("zip")) return <ZipIcon />
  if (file.contentType.includes("video")) return <VideoIcon />
  if (file.contentType.includes("text/plain")) return <TextFileIcon />
  if (file.contentType.includes("application")) return <CodeIcon />

  return <FileIcon />
}
