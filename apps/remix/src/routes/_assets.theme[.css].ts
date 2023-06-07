import { type DataFunctionArgs, redirect } from "@remix-run/server-runtime";

import { parseCookie } from "@gs/service/cookie.server";
import getCSSForThemeName, { DEFAULT_THEME, type ThemeName } from "@gs/theme";
import { getThemeFromRequest, themeCookie } from "@gs/theme/cookie.server";

export async function loader({ request }: DataFunctionArgs) {
  const themeName = await getThemeFromRequest(request);
  const css = getCSSForThemeName(themeName);

  return new Response(css, {
    status: 200,
    headers: {
      "Content-Type": "text/css",
      "Cache-Control": "public, max-age=0",
    },
  });
}

export async function action({ request }: DataFunctionArgs) {
  const parsedCookie = await parseCookie(request, themeCookie);
  const formData = await request.formData();

  const redirectTo = formData.get("originPath")?.toString() || "/";
  const newThemeName = formData.get("theme")?.toString();
  const prevThemeName: ThemeName = parsedCookie.theme || DEFAULT_THEME;
  if (newThemeName === "toggle") {
    parsedCookie.theme = prevThemeName === "light" ? "dark" : "light";
  } else {
    parsedCookie.theme = newThemeName || prevThemeName;
  }

  return redirect(redirectTo, {
    headers: { "Set-Cookie": await themeCookie.serialize(parsedCookie) },
  });
}

export function CatchBoundary() {}
