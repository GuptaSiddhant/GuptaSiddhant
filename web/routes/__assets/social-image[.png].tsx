import type { LoaderFunction } from "@remix-run/server-runtime"

import { DEFAULT_THEME, getThemeFromThemeName } from "@gs/theme"

export const loader: LoaderFunction = async ({ request }) => {
  const { searchParams, origin } = new URL(request.url)
  const theme = getThemeFromThemeName(DEFAULT_THEME)

  const title = searchParams.get("title")
  if (!title) return new Response("title is required", { status: 400 })

  const url = searchParams.get("url") || origin
  const caption = searchParams.get("caption") || ""
  const subtitle = searchParams.get("subtitle") || ""
  const imageUrl = searchParams.get("imageUrl") || ""

  const params = new URLSearchParams({
    title,
    subtitle,
    caption,
    textColor: theme.text.default,
    backgroundColor: theme.bg.primary,
    borderColor: theme.bg.default,
    imageUrl,
    url,
  })

  const image = await fetch(
    `https://europe-west1-guptasiddhant-com.cloudfunctions.net/socialImage?` +
      params.toString(),
  ).then((res) => res.blob())

  return new Response(image, {
    headers: {
      "Content-Type": "image/png",
      "Content-Length": image.size.toString(),
      "Cache-Control": "public, max-age=31536000",
    },
  })
}

export function CatchBoundary() {}
