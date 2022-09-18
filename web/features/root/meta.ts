import { type MetaDescriptor } from "@remix-run/server-runtime"

import { getThemeFromThemeName } from "@gs/theme"

import type { RootLoaderData } from "."

export default function meta({
  data,
}: {
  data: RootLoaderData
}): MetaDescriptor {
  const { themeName, about } = data
  const { name = "Siddhant Gupta", shortName = "GS" } = about
  const description = "Webfolio of a creator."

  const theme = getThemeFromThemeName(themeName)
  const themeColor = theme.bg.default

  return {
    title: name,
    description,
    charset: "utf-8",
    viewport:
      "width=device-width,initial-scale=1.0,maximum-scale=1.0,viewport-fit=cover",

    "application-name": shortName,
    "apple-mobile-web-app-title": shortName,
    "theme-color": themeColor,
    "msapplication-TileColor": themeColor,
    "msapplication-config": "/assets/browserconfig.xml",
    // Open graph
    "og:title": name,
    "og:description": description,
    "og:locale": "en_GB",
    "og:type": "website",
    "og:site_name": shortName,
    // Twitter
    "twitter:creator": "@guptasiddhant9",
    "twitter:card": "summary",
  }
}
