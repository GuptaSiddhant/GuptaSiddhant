import { ModelName } from "@gs/models";
import Database from "@gs/service/database.server";
import { type SummaryItem } from "@gs/summary";
import { querySummaryItemsByModelName } from "@gs/summary/service.server";
import { generateDurationString } from "@gs/utils/format";

import type { EducationProps } from "./education.model";
import { getProjectsSummaryItems } from "./projects.server";

const modelName = ModelName.Education;
const db = new Database<EducationProps>(modelName);

export function getEducationModelName() {
  return modelName;
}

export function getEducationDatabase() {
  return db;
}

export async function getEducationKeys() {
  return db.queryKeys();
}

export async function getEducationSummaryItems() {
  return querySummaryItemsByModelName(modelName);
}

export async function getEducationAssociatedProjects(id: string) {
  const projects = await getProjectsSummaryItems();

  return projects.filter(
    ({ association }) => association === `${modelName}/${id}`,
  );
}

// Get original item

export async function getEducationItem(
  id: string,
  transform: true,
  ignoreCache?: boolean,
): Promise<SummaryItem>;
export async function getEducationItem(
  id: string,
  transform: false,
  ignoreCache?: boolean,
): Promise<EducationProps>;
export async function getEducationItem(id: string): Promise<EducationProps>;
export async function getEducationItem(
  id: string,
  transform?: boolean,
  ignoreCache?: boolean,
): Promise<unknown> {
  const item = await db.queryById(id, ignoreCache);
  const cover: string | undefined = item.gallery?.[0]?.url;

  if (!transform) {
    return { ...item, cover };
  }

  return transformEducationToSummaryItem({ ...item, cover });
}

function transformEducationToSummaryItem({
  degree,
  field,
  school,
  location,
  ...rest
}: EducationProps): SummaryItem {
  return {
    ...rest,
    model: modelName,
    title: [degree, field].filter(Boolean).join(" - "),
    subtitle: [school, location].filter(Boolean).join(", "),
    duration: generateDurationString(rest),
  };
}

export { EducationProps };
