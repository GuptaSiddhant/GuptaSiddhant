import { type LoaderFunctionArgs } from "react-router";

import generateResumePdfString from "@gs/resume";

export async function loader({ request }: LoaderFunctionArgs) {
  const pdfString = await generateResumePdfString(new URL(request.url));

  return new Response(pdfString, {
    status: 200,
    headers: { "Content-Type": "application/pdf" },
  });
}

export function CatchBoundary() {}
