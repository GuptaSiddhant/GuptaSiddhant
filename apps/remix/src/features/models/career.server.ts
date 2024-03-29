import { ModelName } from "@gs/models";
import Database from "@gs/service/database.server";
import { type SummaryItem } from "@gs/summary";
import { querySummaryItemsByModelName } from "@gs/summary/service.server";
import { generateDurationString } from "@gs/utils/format";

import type { CareerProps } from "./career.model";
import { getProjectsSummaryItems } from "./projects.server";

const modelName = ModelName.Career;
const db = new Database<CareerProps>(modelName);

export function getCareerModelName() {
  return modelName;
}

export function getCareerDatabase() {
  return db;
}

export async function getCareerKeys() {
  return db.queryKeys();
}

export async function getCareerSummaryItems() {
  return querySummaryItemsByModelName(modelName);
}

export async function getCareerAssociatedProjects(id: string) {
  const projects = await getProjectsSummaryItems();

  return projects.filter(
    ({ association }) => association === `${modelName}/${id}`,
  );
}

// Get original item

export async function getCareerItem(
  id: string,
  transform: true,
  ignoreCache?: boolean,
): Promise<SummaryItem>;
export async function getCareerItem(
  id: string,
  transform: false,
  ignoreCache?: boolean,
): Promise<CareerProps>;
export async function getCareerItem(id: string): Promise<CareerProps>;
export async function getCareerItem(
  id: string,
  transform?: boolean,
  ignoreCache?: boolean,
): Promise<unknown> {
  const item = await db.queryById(id, ignoreCache);
  const cover: string | undefined = item.gallery?.[0]?.url;

  if (!transform) {
    return { ...item, cover };
  }

  return transformCareerToSummaryItem({ ...item, cover });
}

export function transformCareerToSummaryItem({
  position,
  company,
  location,
  ...rest
}: CareerProps): SummaryItem {
  return {
    ...rest,
    model: modelName,
    title: [position].filter(Boolean).join(" - "),
    subtitle: [company, location].filter(Boolean).join(", "),
    duration: generateDurationString(rest),
  };
}

export { CareerProps };
