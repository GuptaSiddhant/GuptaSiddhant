import { createCookie, redirect } from "@remix-run/node";
import { parseCookie } from "@gs/service/cookie.server";

export const pwaCookie = createCookie("__gs_pwa");

export async function getPwaFromRequest(request: Request): Promise<boolean> {
  const parsedCookie = await parseCookie(request, pwaCookie);
  const url = new URL(request.url);

  const currentPwa = parsedCookie.pwa;
  const isEnablePwa = url.searchParams.has("pwa");
  const isDisablePwa = url.searchParams.has("no-pwa");

  if (isEnablePwa) {
    parsedCookie.pwa = true;
  } else if (isDisablePwa || !parsedCookie.pwa) {
    parsedCookie.pwa = false;
  }

  if (currentPwa !== parsedCookie.pwa) {
    throw redirect(url.toString(), {
      headers: { "Set-Cookie": await pwaCookie.serialize(parsedCookie) },
    });
  }

  return parsedCookie.pwa;
}
