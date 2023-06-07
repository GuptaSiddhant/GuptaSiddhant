import type { DataFunctionArgs } from "@remix-run/server-runtime";

import generateResumePdfString from "@gs/resume";

export async function loader({ request }: DataFunctionArgs) {
  const pdfString = await generateResumePdfString(new URL(request.url));

  return new Response(pdfString, {
    status: 200,
    headers: { "Content-Type": "application/pdf" },
  });
}

export function CatchBoundary() {}
