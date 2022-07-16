import generateResumePdfString from "@gs/resume"
import type { LoaderFunction } from "@remix-run/server-runtime"

export const loader: LoaderFunction = async ({ request }) => {
  const pdfString = await generateResumePdfString(new URL(request.url))

  return new Response(pdfString, {
    status: 200,
    headers: { "Content-Type": "application/pdf" },
  })
}

export function CatchBoundary() {}