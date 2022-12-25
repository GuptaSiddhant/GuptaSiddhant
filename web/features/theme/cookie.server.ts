import { createCookie } from "@remix-run/node";

import { parseCookie } from "@gs/service/cookie.server";
import { type ThemeName, DEFAULT_THEME } from "@gs/theme";

export const themeCookie = createCookie("__gs_theme");

export async function getThemeFromRequest(
  request: Request,
): Promise<ThemeName> {
  const parsedCookie = await parseCookie(request, themeCookie);
  if (!parsedCookie.theme) {
    parsedCookie.theme = DEFAULT_THEME;
  }

  return parsedCookie.theme;
}
