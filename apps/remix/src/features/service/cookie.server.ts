import { type Cookie } from "@remix-run/node";

export async function parseCookie(request: Request, cookie: Cookie) {
  const cookieHeader = request.headers.get("Cookie");
  const parsedCookie = (await cookie.parse(cookieHeader)) || {};

  return parsedCookie;
}
