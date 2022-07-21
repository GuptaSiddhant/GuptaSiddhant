import { type Cookie, createCookie } from "@remix-run/node"

import { type ThemeName, DEFAULT_THEME } from "@gs/theme"

export const themeCookie = createCookie("theme")

export async function parseCookie(request: Request, cookie: Cookie) {
  const cookieHeader = request.headers.get("Cookie")
  const parsedCookie = (await cookie.parse(cookieHeader)) || {}

  return parsedCookie
}

export async function getThemeFromRequest(
  request: Request,
): Promise<ThemeName> {
  const parsedCookie = await parseCookie(request, themeCookie)
  if (!parsedCookie.theme) {
    parsedCookie.theme = DEFAULT_THEME
  }

  return parsedCookie.theme
}
