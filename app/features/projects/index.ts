import { type HtmlMetaDescriptor } from "@remix-run/server-runtime"

import { createMetaTitle } from "~/packages/helpers"
import { type TeaserProps } from "~/packages/teaser"
import { type Gallery, type LinkObject } from "~/packages/types"

export interface ProjectProps extends TeaserProps {
  association?: string
  dateEnd?: string
  dateStart: string
  content?: string
  links?: LinkObject[]
  gallery?: Gallery
}

export function generateProjectMeta(
  project?: ProjectProps,
  url?: string,
  id?: string,
): HtmlMetaDescriptor {
  if (!project)
    return { title: "Project 404", description: `Project '${id}' not found` }

  const { title, description, cover, tags = [] } = project

  return {
    title: createMetaTitle(title),
    description,
    "og:title": title,
    "og:description": description,
    "og:image": cover,
    "og:url": url,
    "og:type": "article",
    "og:article:section": "Project",
    "og:article:tag": tags,
    "og:article:author": "Siddhant Gupta",
    "twitter:card": "summary_large_image",
  }
}
