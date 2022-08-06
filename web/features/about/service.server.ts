import { redirect } from "@remix-run/server-runtime"

import Database from "@gs/service/database.server"
import { ModelName } from "@gs/models"

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

export function redirectToAbout(path?: string) {
  const pathWithoutSlash = path?.split("/").slice(0, -1).join("-") || ""

  return redirect(`/about/#${pathWithoutSlash}`, 301)
}
