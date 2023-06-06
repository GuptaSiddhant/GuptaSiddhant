import { ModelName } from "@gs/models";
import generateRss from "@gs/rss.server";
import Database from "@gs/service/database.server";
import {
  type SummaryItem,
  getCrossSellSummaryItems,
  sortSummaryItemsByDateLatestFirstPredicate,
} from "@gs/summary";
import { querySummaryItemsByModelName } from "@gs/summary/service.server";

import type { BlogPostProps } from "./blog.model";

const modelName = ModelName.Blog;
const db = new Database<BlogPostProps>(modelName);

export { BlogPostProps };

export function getBlogModelName() {
  return modelName;
}

export function getBlogDatabase() {
  return db;
}

export async function getBlogKeys() {
  return db.queryKeys();
}

export async function getBlogSummaryItems() {
  return querySummaryItemsByModelName(modelName);
}

export async function getBlogPost(id: string): Promise<BlogPostProps> {
  const post = await db.queryById(id);
  const cover: string | undefined = post?.gallery?.[0]?.url;

  return { ...post, cover };
}

export async function getBlogPostCrossSell(
  id: string,
  limit: number = 6,
): Promise<SummaryItem[]> {
  const items = await getBlogSummaryItems();

  return getCrossSellSummaryItems(items, id).slice(0, limit);
}

export async function generateBlogFeed(origin: string) {
  const posts = await getBlogSummaryItems();
  const baseUrl = `${origin}/blog`;

  return generateRss({
    title: "GS Blog",
    description: "Thoughts on somethings. Sometimes everything.",
    link: baseUrl,
    origin,
    entries: posts
      .sort(sortSummaryItemsByDateLatestFirstPredicate)
      .map((post) => ({
        description: post.description || post.subtitle || "",
        pubDate: post.date ? new Date(post.date) : new Date(),
        title: post.title,
        link: `${baseUrl}/${post.id}`,
        guid: `${baseUrl}/${post.id}`,
        author: "Siddhant Gupta",
      })),
  });
}
