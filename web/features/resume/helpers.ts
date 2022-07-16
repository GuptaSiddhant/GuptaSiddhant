import { type AboutInfo } from "@gs/about"
import { parseGetAllSearchParams } from "@gs/helpers/request"

import type { ContactLinkProps } from "./types"

export enum Sections {
  about = "about",
  experience = "experience",
  education = "education",
  skills = "skills",
}

export function transformAboutLinkToContactLinks(
  link: AboutInfo["link"],
): ContactLinkProps[] {
  if (!link) return []

  return Object.entries(link)
    .sort()
    .map(([key, linkUrl]) => {
      const value =
        key.toLowerCase() === "email"
          ? linkUrl.split(":")[1]
          : key.toLowerCase() === "website"
          ? linkUrl.split("//")[1]
          : key.toLowerCase() === "linkedin"
          ? linkUrl.split("in/")[1]
          : key.toLowerCase() === "github"
          ? linkUrl.split("com/")[1]
          : linkUrl

      return {
        key,
        value,
        linkUrl,
      }
    })
}

export function createAboutLink(domain: string, id: string) {
  return `${domain}/about/${id}`
}

export function getFiltersFromSearchParams(searchParams: URLSearchParams): {
  from?: Date
  till?: Date
  disabledSections?: Record<Sections, boolean>
  tags: string[]
} {
  const fromParam = searchParams.get("from")
  const toParam = searchParams.get("to")
  const tags = parseGetAllSearchParams(searchParams, "tag").map((t) =>
    t.toLowerCase(),
  )
  const enabledSections = parseGetAllSearchParams(searchParams, "section").map(
    (s) => s.toLowerCase(),
  )

  const disabledSections = {} as Record<Sections, boolean>
  if (enabledSections.length > 0) {
    Object.keys(Sections).forEach((key) => {
      disabledSections[key as Sections] = enabledSections.includes(key)
        ? false
        : true
    })
  }

  return {
    disabledSections,
    from: fromParam ? new Date(fromParam) : undefined,
    till: toParam ? new Date(toParam) : undefined,
    tags,
  }
}
