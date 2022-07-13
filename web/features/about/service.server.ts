import Database, { DatabaseModel } from "@gs/service/database.server"

import type { AboutInfo, Skills } from "."

const databaseInfo = new Database(DatabaseModel.Info)

export async function getAboutInfo() {
  return databaseInfo.queryById<AboutInfo>("about")
}

export async function getSkills() {
  const { backend, design, frontend, language, soft } =
    await databaseInfo.queryById<Skills>("skills")
  return {
    backend,
    design,
    frontend,
    language,
    soft,
  }
}
