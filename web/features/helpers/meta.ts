import { type HtmlMetaDescriptor } from "@remix-run/server-runtime"

import { type SummaryItem } from "@gs/summary"

export function createMetaTitle(title?: string) {
  if (!title) return "Siddhant Gupta"

  return `${title} | GS`
}

export function generateArticleMeta<T extends SummaryItem>(
  article?: T,
  options?: {
    id?: string
    section?: string
    url?: string
  },
): HtmlMetaDescriptor {
  if (!article)
    return {
      title: "Blog 404",
      description: `${options?.section || "Article"} '${
        options?.id
      }' not found`,
    }

  const url = options?.url ? new URL(options?.url) : undefined

  const {
    title,
    description,
    cover,
    tags = [],
    linkUrl,
    subtitle = "",
  } = article

  const socialImageUrl =
    (url?.origin || "") +
    "/social-image.png?" +
    new URLSearchParams({
      title,
      subtitle,
      imageUrl: cover || "",
      url: options?.url || linkUrl || "",
      caption: options?.section || "",
    }).toString()

  return {
    title: createMetaTitle(title),
    description,
    "og:title": title,
    "og:description": description,
    "og:image": socialImageUrl,
    "og:url": options?.url,
    "og:type": "article",
    "og:article:section": options?.section,
    "og:article:tag": tags,
    "og:article:author": "Siddhant Gupta",
    "twitter:card": "summary_large_image",
  }
}
