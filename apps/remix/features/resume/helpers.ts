import { type AboutInfo } from "@features/about"
import { parseGetAllSearchParams } from "@features/helpers/request"

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
} {
  const fromParam = searchParams.get("from")
  const toParam = searchParams.get("to")
  const enabledSections = parseGetAllSearchParams(searchParams, "section").map(
    (s) => s.toLowerCase(),
  )

  let disabledSections: Record<Sections, boolean> | undefined = undefined

  if (enabledSections.length > 0) {
    disabledSections = Object.keys(Sections).reduce(
      (acc, key) => ({
        ...acc,
        [key]: enabledSections.includes(key) ? false : true,
      }),
      {} as Record<Sections, boolean>,
    )
  }

  return {
    disabledSections,
    from: fromParam ? new Date(fromParam) : undefined,
    till: toParam ? new Date(toParam) : undefined,
  }
}
