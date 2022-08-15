import { createElement } from "react"
import { renderCanvas, Text, View } from "recanvas"

import type { LoaderFunction } from "@remix-run/server-runtime"

import { type ThemeColors, getThemeFromThemeName } from "@gs/theme"
import { getThemeFromRequest } from "@gs/theme/cookie.server"
import invariant from "@gs/utils/invariant"

export const loader: LoaderFunction = async ({ request }) => {
  const themeName = await getThemeFromRequest(request)
  const theme = getThemeFromThemeName(themeName)
  const { searchParams } = new URL(request.url)

  const title = searchParams.get("title")
  invariant(title, "title is required")
  const subtitle = searchParams.get("subtitle") ?? undefined
  const imageUrl = searchParams.get("imageUrl") ?? undefined

  return new Response(generateThumbnail({ theme, title, subtitle, imageUrl }), {
    status: 200,
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "s-maxage=31536000, stale-while-revalidate",
    },
  })
}

export function CatchBoundary() {}

function generateThumbnail({
  theme,
  title,
  subtitle,
  imageUrl,
}: {
  theme: ThemeColors
  title: string
  subtitle?: string
  imageUrl?: string
}): Buffer {
  const width = 800
  const height = width * (9 / 16)
  const color = theme.text.default
  const backgroundColor = theme.bg.primary
  const padding = 20

  const canvas = renderCanvas(
    createElement(
      View,
      { style: { backgroundColor } as any },
      createElement(Text, { style: { color } as any }, "Hello"),
    ),
    {
      width,
      height,
      paddingBottom: padding,
      paddingTop: padding,
      paddingRight: padding,
      paddingLeft: padding,
    },
  )

  return canvas.toBuffer()
}
