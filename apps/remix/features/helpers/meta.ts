import { type TeaserProps } from "@features/teaser"
import { type HtmlMetaDescriptor } from "@remix-run/server-runtime"

export function createMetaTitle(title?: string) {
  if (!title) return "Siddhant Gupta"

  return `${title} | GS`
}

export function generateArticleMeta<T extends TeaserProps>(
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

  const { title, description, cover, tags = [] } = article

  return {
    title: createMetaTitle(title),
    description,
    "og:title": title,
    "og:description": description,
    "og:image": cover,
    "og:url": options?.url,
    "og:type": "article",
    "og:article:section": options?.section,
    "og:article:tag": tags,
    "og:article:author": "Siddhant Gupta",
    "twitter:card": "summary_large_image",
  }
}
