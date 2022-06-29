import type { LoaderFunction } from "@remix-run/server-runtime"

import { getThemeFromRequest } from "~/features/service/themeCookie.server"
import themes, { generateCSSValue } from "~/features/styles/theme"

export const loader: LoaderFunction = async ({ request }) => {
  const themeName = await getThemeFromRequest(request)
  const theme = themes[themeName]

  return new Response(generateCSSValue(theme), {
    status: 200,
    headers: { "Content-Type": "text/css" },
  })
}

export function CatchBoundary() {}
