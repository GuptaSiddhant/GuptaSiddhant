import { createCookieSessionStorage } from "@remix-run/node"

const sessionSecret = process.env.SESSION_SECRET

if (!sessionSecret) {
  throw new Error("SESSION_SECRET must be set")
}

const cookieSession = createCookieSessionStorage({
  cookie: {
    name: "__session",
    secure: true,
    secrets: [sessionSecret],
    sameSite: "lax", // to help with CSRF
    path: "/",
    maxAge: 60 * 60 * 24 * 5, // 5 days
    httpOnly: true,
  },
})

export default cookieSession
