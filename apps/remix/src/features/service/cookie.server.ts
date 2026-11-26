import { type Cookie } from "react-router";

export async function parseCookie(request: Request, cookie: Cookie) {
  const cookieHeader = request.headers.get("Cookie");
  const parsedCookie = (await cookie.parse(cookieHeader)) || {};

  return parsedCookie;
}
