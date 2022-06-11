import { type HtmlMetaDescriptor } from "@remix-run/server-runtime"

import { createMetaTitle } from "~/packages/helpers"
import { type TeaserProps } from "~/packages/teaser"
import { type Gallery, type LinkObject } from "~/packages/types"

export interface BlogPostProps extends TeaserProps {
  association?: string
  content?: string
  links?: LinkObject[]
  gallery?: Gallery
}

export function generateBlogPostMeta(
  post?: BlogPostProps,
  url?: string,
  id?: string,
): HtmlMetaDescriptor {
  if (!post)
    return { title: "Blog 404", description: `Blog post '${id}' not found` }

  const { title, description, cover, tags = [] } = post

  return {
    title: createMetaTitle(title),
    description,
    "og:title": title,
    "og:description": description,
    "og:image": cover,
    "og:url": url,
    "og:type": "article",
    "og:article:section": "Blog",
    "og:article:tag": tags,
    "og:article:author": "Siddhant Gupta",
  }
}
