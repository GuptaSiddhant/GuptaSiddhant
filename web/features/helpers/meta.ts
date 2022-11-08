import { type HtmlMetaDescriptor } from "@remix-run/server-runtime";

import { type SummaryItem } from "@gs/summary";

const author = "Siddhant Gupta";

export function createMetaTitle(title?: string) {
  if (!title) {
    return author;
  }

  return `${title} | GS`;
}

export function generateArticleMeta<T extends SummaryItem>(
  article?: T,
  options?: {
    id?: string;
    section?: string;
    url?: string;
  },
): HtmlMetaDescriptor {
  if (!article) {
    return {
      title: "Blog 404",
      description: `${options?.section || "Article"} '${
        options?.id
      }' not found`,
    };
  }

  const url = options?.url ? new URL(options?.url) : undefined;

  const {
    title,
    description,
    cover,
    tags = [],
    linkUrl,
    subtitle = "",
    date,
  } = article;

  const searchParams = new URLSearchParams({
    title,
    subtitle,
    imageUrl: cover || "",
    url: options?.url || linkUrl || "",
    caption: options?.section || "",
  });

  const socialImageUrl = `${
    url?.origin || ""
  }/social-image.png?${searchParams.toString()}`;

  const publishedTime = date ? new Date(date).toISOString() : undefined;

  return {
    title: createMetaTitle(title),
    description,
    "og:title": title,
    "og:description": description,
    "og:author": author,
    "og:image": socialImageUrl,
    "og:url": options?.url,
    "og:type": "article",
    "og:section": options?.section,
    "og:tag": tags.join(","),
    "og:published_time": publishedTime,
    "og:article:published_time": publishedTime,
    "og:article:section": options?.section,
    "og:article:tag": tags.join(","),
    "og:article:author": "Siddhant Gupta",
    "twitter:card": "summary_large_image",
  };
}
