import Database, { ModelName } from "@gs/service/database.server"

import type { AboutInfo, Skills } from "."

const databaseInfo = new Database(ModelName.About)

export async function getAboutInfo() {
  return databaseInfo.queryById<AboutInfo>("info")
}

export async function getAboutSkills() {
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
