import { ModelName } from "@gs/models";
import Database from "@gs/service/database.server";
import { type SummaryItem, getCrossSellSummaryItems } from "@gs/summary";
import { querySummaryItemsByModelName } from "@gs/summary/service.server";

import {
  getCareerItem,
  getCareerKeys,
  getCareerModelName,
} from "./career.server";
import {
  getEducationItem,
  getEducationKeys,
  getEducationModelName,
} from "./education.server";
import type { ProjectProps } from "./projects.model";

const modelName = ModelName.Projects;
const db = new Database<ProjectProps>(modelName);

export function getProjectsModelName() {
  return modelName;
}

export function getProjectsDatabase() {
  return db;
}

export async function getProjectsKeys() {
  return db.queryKeys();
}

export async function getProjectsSummaryItems() {
  return querySummaryItemsByModelName(modelName);
}

export async function getProject(id: string): Promise<ProjectProps> {
  const project = await db.queryById(id);
  const cover: string | undefined = project?.gallery?.[0]?.url;

  return { ...project, cover };
}

export async function getProjectCrossSell(
  id: string,
  limit: number = 6,
): Promise<SummaryItem[]> {
  const items = await getProjectsSummaryItems();

  return getCrossSellSummaryItems(items, id).slice(0, limit);
}

export async function getProjectAssociationKeys() {
  const keysList = await Promise.all([
    getEducationKeys().then((keys) =>
      keys.map((k) => `${getEducationModelName()}/${k}`),
    ),
    getCareerKeys().then((keys) =>
      keys.map((k) => `${getCareerModelName()}/${k}`),
    ),
  ]);

  return keysList.flat().sort();
}

export async function getProjectAssociationById(
  assocId?: string,
): Promise<SummaryItem | undefined> {
  if (!assocId) {
    return undefined;
  }

  if (assocId.includes("/")) {
    const [modelName, id] = assocId.split("/");

    return Database.queryModelById(modelName, id) as Promise<SummaryItem>;
  }

  const [educationItem, careerItem] = await Promise.allSettled([
    getEducationItem(assocId, true),
    getCareerItem(assocId, true),
  ]);

  return careerItem.status === "fulfilled"
    ? careerItem.value
    : educationItem.status === "fulfilled"
    ? educationItem.value
    : undefined;
}

export { ProjectProps };
