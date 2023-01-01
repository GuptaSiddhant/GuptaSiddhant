import { ONE_DAY_IN_S } from "@gs/constants";
import type { LoaderFunction } from "@remix-run/server-runtime";

export const loader: LoaderFunction = async ({ request }) => {
  const { origin } = new URL(request.url);

  /** @todo add all routes */
  const content = `
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
<url>
<loc>${origin}</loc>
<lastmod>${new Date().toISOString()}</lastmod>
<priority>1.0</priority>
</url>
</urlset>
`;

  return new Response(content, {
    status: 200,
    headers: {
      "Content-Type": "application/xml",
      "xml-version": "1.0",
      encoding: "UTF-8",
      "Cache-Control": ONE_DAY_IN_S.toString(),
    },
  });
};

export function CatchBoundary() {}
