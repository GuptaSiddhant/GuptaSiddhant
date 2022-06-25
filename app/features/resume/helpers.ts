import { type AboutInfo } from "~/features/about"

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
