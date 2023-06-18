import type { DatabaseDocument } from "@gs/service/database.server";
import type Database from "@gs/service/database.server";

import { ModelName, getModelByModelName } from ".";
import { getAboutInfo, getAboutSkills } from "./about.server";
import { getBlogPost } from "./blog.server";
import { getCareerItem } from "./career.server";
import { getEducationItem } from "./education.server";
import parseFormDataWithModelObject from "./helpers/parser";
import { getProject } from "./projects.server";
import { getUserById } from "./users.server";

export async function mutateDatabaseByModelNameAndFormData(
  modelName: ModelName,
  formData: FormData,
  database: Database,
  id: string,
) {
  const invalidate = formData.get("invalidate")?.toString() === "true";
  const model = getModelByModelName(modelName);
  const data = parseFormDataWithModelObject(
    formData,
    model,
  ) as unknown as DatabaseDocument;

  if (invalidate) {
    database.invalidateCacheById(id);
  } else {
    database.mutateById(id, data);
  }
}

export async function getItemByModelName(modelName: ModelName, id?: string) {
  if (!id) {
    switch (modelName) {
      case ModelName.About:
        return getAboutInfo();
      case ModelName.Skills:
        return getAboutSkills();
      default:
        throw new Error(`Unknown model name: ${modelName}`);
    }
  }

  switch (modelName) {
    case ModelName.Career:
      return getCareerItem(id);
    case ModelName.Education:
      return getEducationItem(id);
    case ModelName.Blog:
      return getBlogPost(id);
    case ModelName.Projects:
      return getProject(id);
    case ModelName.Users:
      return getUserById(id);
    default:
      throw new Error(`Unknown model name: ${modelName}`);
  }
}
