import {
  type ActionFunction,
  type LoaderFunction,
  redirect,
} from "@remix-run/server-runtime"

import getCSSForThemeName, {
  type ThemeName,
  DEFAULT_THEME,
} from "~/features/theme"
import {
  getThemeFromRequest,
  parseCookie,
  themeCookie,
} from "~/features/theme/cookie.server"

export const loader: LoaderFunction = async ({ request }) => {
  const themeName = await getThemeFromRequest(request)
  const css = getCSSForThemeName(themeName)

  return new Response(css, {
    status: 200,
    headers: {
      "Content-Type": "text/css",
      "Cache-Control": "public, max-age=0",
    },
  })
}

export const action: ActionFunction = async ({ request }) => {
  const parsedCookie = await parseCookie(request, themeCookie)
  const formData = await request.formData()

  const redirectTo = formData.get("origin")?.toString() || "/"
  const newThemeName = formData.get("theme")?.toString()
  const prevThemeName: ThemeName = parsedCookie.theme || DEFAULT_THEME

  parsedCookie.theme = newThemeName || prevThemeName

  return redirect(redirectTo, {
    headers: { "Set-Cookie": await themeCookie.serialize(parsedCookie) },
  })
}

export function CatchBoundary() {}
