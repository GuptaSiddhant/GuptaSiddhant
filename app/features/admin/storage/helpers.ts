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
      children: dirs.map((dir) => ({
        id: dir,
        children: extractLastPartOfFilePath(dir),
        to: dir,
      })),
    },
    {
      id: "files",
      label: "Files",
      children: files.map((file) => ({
        id: file.id,
        children: extractLastPartOfFilePath(file.name),
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
