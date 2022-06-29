import { type Cookie, createCookie, redirect } from "@remix-run/node"

import type { ThemeName } from "~/features/types"

const DEFAULT_THEME: ThemeName = "dark"

const themeCookie = createCookie("theme")

async function parseCookie(request: Request, cookie: Cookie) {
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

export async function setThemeFromRequest(request: Request) {
  const parsedCookie = await parseCookie(request, themeCookie)
  const formData = await request.formData()

  parsedCookie.theme =
    formData.get("theme")?.toString() || parsedCookie.theme || DEFAULT_THEME

  return redirect("", {
    headers: {
      "Set-Cookie": await themeCookie.serialize(parsedCookie),
    },
  })
}
