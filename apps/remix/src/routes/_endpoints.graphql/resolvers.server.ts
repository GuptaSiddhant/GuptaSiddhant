import { getAboutInfo } from "@gs/models/about.server";
import { getBlogSummaryItems } from "@gs/models/blog.server";
import { getCareerSummaryItems } from "@gs/models/career.server";
import { getEducationSummaryItems } from "@gs/models/education.server";
import { getProjectsSummaryItems } from "@gs/models/projects.server";
import { getUserKeys } from "@gs/models/users.server";
import { authenticate } from "@gs/service/auth.server";
import type { SummaryItem } from "@gs/summary";

interface Context {
  request: Request;
}

export function test() {
  return true;
}

export async function about() {
  return await getAboutInfo();
}

// List queries

interface QueryListOptions {
  limit?: number;
}

async function getItemList<Item>(
  getterFn: () => Promise<Item[]>,
  { limit }: QueryListOptions,
): Promise<Item[]> {
  const items = await getterFn();

  if (!limit) return items;
  return items.slice(0, limit);
}

export async function projects(
  options: QueryListOptions,
): Promise<SummaryItem[]> {
  return getItemList(getProjectsSummaryItems, options);
}

export async function blog(options: QueryListOptions): Promise<SummaryItem[]> {
  return getItemList(getBlogSummaryItems, options);
}

export async function education(
  options: QueryListOptions,
): Promise<SummaryItem[]> {
  return getItemList(getEducationSummaryItems, options);
}

export async function career(
  options: QueryListOptions,
): Promise<SummaryItem[]> {
  return getItemList(getCareerSummaryItems, options);
}

export async function users(
  options: QueryListOptions,
  { request }: Context,
): Promise<string[]> {
  await authenticate(request);

  return getItemList(getUserKeys, options);
}

// Mutations

export async function setMessage(
  { message }: { message: string },
  { request }: Context,
): Promise<string> {
  await authenticate(request);

  return `Hi, ${message}`;
}
