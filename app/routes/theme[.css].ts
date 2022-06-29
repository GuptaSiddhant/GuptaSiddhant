import type { LoaderFunction } from "@remix-run/server-runtime"

import themes, { generateCSSValue } from "~/features/styles/theme"

export const loader: LoaderFunction = async ({ request }) => {
  const theme = themes.dark

  return new Response(generateCSSValue(theme), {
    status: 200,
    headers: { "Content-Type": "text/css" },
  })
}

export function CatchBoundary() {}
