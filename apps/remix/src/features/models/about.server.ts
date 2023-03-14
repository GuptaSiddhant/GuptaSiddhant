import { redirect } from "@remix-run/server-runtime";

import { ModelName } from "@gs/models";
import Database from "@gs/service/database.server";

import type { AboutInfo } from "./about-info.model";
import type { Skills } from "./about-skills.model";

const modelName = ModelName.About;
const db = new Database(modelName);

export const aboutInfoKey = "info";
export const aboutSkillsKey = "skills";

export function getAboutModelName() {
  return modelName;
}
export function getAboutSkillsModelName() {
  return ModelName.Skills;
}

export function getAboutDatabase() {
  return db;
}

export async function getAboutKeys() {
  return db.queryKeys();
}

export async function getAboutInfo() {
  return db.queryById<AboutInfo>(aboutInfoKey);
}

export async function getAboutSkills() {
  return db.queryById<Skills>(aboutSkillsKey);
}

export { AboutInfo, Skills };

export function redirectToAbout(path?: string) {
  const pathWithoutSlash =
    path
      ?.split("/")
      .filter((t) => t !== "")
      .join("-") || "";

  return redirect(`/about/#${pathWithoutSlash}`, 301);
}
