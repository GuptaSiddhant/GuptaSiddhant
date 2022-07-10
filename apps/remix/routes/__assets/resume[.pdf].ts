import type { LoaderFunction } from "@remix-run/server-runtime"

import generateResumePdfString from "~/features/resume"

export const loader: LoaderFunction = async ({ request }) => {
  const pdfString = await generateResumePdfString(request)

  return new Response(pdfString, {
    status: 200,
    headers: { "Content-Type": "application/pdf" },
  })
}

export function CatchBoundary() {}