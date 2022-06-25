import { type AboutInfo } from "~/features/about"

import { parseGetAllSearchParams } from "../helpers/request"
import { type ResumeProps, defaultDisabledSections } from "./Resume"
import type { ContactLinkProps } from "./types"

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

export function getDisabledSectionsFromSearchParams(
  searchParams: URLSearchParams,
): ResumeProps["disabledSections"] {
  const enabledSections = parseGetAllSearchParams(searchParams, "section")

  if (enabledSections.length === 0) return undefined

  return Object.keys(defaultDisabledSections).reduce(
    (acc, key) => ({
      ...acc,
      [key]: enabledSections.includes(key) ? false : true,
    }),
    {},
  )
}

export function getFiltersFromSearchParams(searchParams: URLSearchParams) {
  const startDateParam = searchParams.get("startDate")
  const endDateParam = searchParams.get("endDate")

  return {
    startDate: startDateParam ? new Date(startDateParam) : undefined,
    endDate: endDateParam ? new Date(endDateParam) : undefined,
  }
}
