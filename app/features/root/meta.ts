import { type MetaFunction } from "@remix-run/server-runtime"

import type { RootLoaderData } from "."

const meta: MetaFunction = ({ data }: { data: RootLoaderData }) => {
  const { name = "Siddhant Gupta" } = data.about

  return {
    title: name,
    description: "Webfolio of a creator.",
    charset: "utf-8",
    viewport: "width=device-width,initial-scale=1.0,maximum-scale=1.0",
    "application-name": name,
    "apple-mobile-web-app-title": name,
    "theme-color": "#000000",
    "msapplication-TileColor": "#000000",
    "og:locale": "en_GB",
    "og:type": "website",
    "og:site_name": "GS",
    "twitter:creator": "@guptasiddhant9",
    "twitter:card": "summary",
  }
}

export default meta
