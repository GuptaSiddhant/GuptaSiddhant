import Database, { DatabaseModel } from "@features/service/database.server"
import storage from "@features/service/storage.server"

export async function backupDatabase() {
  const backupData: Record<string, any> = {}
  const models = Object.values(DatabaseModel)

  for (const model of models) {
    const data = await Database.queryModelAll(model)
    backupData[model] = data
  }

  const str = JSON.stringify(backupData)
  const bytes = new TextEncoder().encode(str)
  const file = new File([bytes], "database.json")
  const filePath = generateBackupPathFromBackupName(
    `${new Date().toISOString()}.json`,
  )

  await storage.mutateAsset(filePath, file)

  return generateBackupNameFromBackupPath(filePath)
}

export function generateBackupNameFromBackupPath(path: string): string {
  return path.split("/").filter(Boolean).slice(-1).join("/").split("backup-")[1]
}

export function generateBackupPathFromBackupName(name: string): string {
  return `backup/backup-${name}`
}
