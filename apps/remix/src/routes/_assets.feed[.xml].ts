import { LoaderFunctionArgs } from "react-router";

import { generateBlogFeed } from "@gs/models/blog.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const { origin } = new URL(request.url);
  const feed = await generateBlogFeed(origin);

  return new Response(feed, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=2419200",
      encoding: "UTF-8",
    },
  });
}
