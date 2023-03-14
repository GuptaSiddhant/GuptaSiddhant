import { type HtmlMetaDescriptor } from "@remix-run/server-runtime";

import { AUTHOR_NAME, AUTHOR_SHORT_NAME } from "@gs/constants";
import { type SummaryItem } from "@gs/summary";

export function createMetaTitle(title?: string) {
  if (!title) return AUTHOR_NAME;

  return `${title} | ${AUTHOR_SHORT_NAME}`;
}

export function generateArticleMeta(
  article?: SummaryItem,
  options?: {
    id?: string;
    section?: string;
    url?: string;
  },
): HtmlMetaDescriptor {
  if (!article) {
    const section = options?.section || "Article";

    return {
      title: `${section} 404`,
      description: `${section} '${options?.id}' not found`,
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
    authorName: AUTHOR_NAME,
    authorImageUrl: "https://people.aalto.fi/files/1201903_x_512_3to4.jpg",
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
    "og:author": AUTHOR_NAME,
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
