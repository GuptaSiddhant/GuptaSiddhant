import type { DataFunctionArgs } from "@remix-run/server-runtime";

export async function loader({ request }: DataFunctionArgs) {
  const { origin } = new URL(request.url);

  const robotText = `
User-agent: Googlebot
Disallow: /nogooglebot/
Disallow: /admin/

User-agent: AdsBot-Google
Disallow: /

User-agent: *
Allow: /
Disallow: /admin/

Sitemap: ${origin}/sitemap.xml
    `;

  return new Response(robotText, {
    status: 200,
    headers: { "Content-Type": "text/plain" },
  });
}

export function CatchBoundary() {}
