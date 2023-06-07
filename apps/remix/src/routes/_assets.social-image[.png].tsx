import type { DataFunctionArgs } from "@remix-run/server-runtime";

import { DEFAULT_THEME, getThemeFromThemeName } from "@gs/theme";

export async function loader({ request }: DataFunctionArgs) {
  const { searchParams, origin } = new URL(request.url);
  const theme = getThemeFromThemeName(DEFAULT_THEME);

  const title = searchParams.get("title");
  if (!title) {
    return new Response("title is required", { status: 400 });
  }

  const url = searchParams.get("url") || origin;
  const caption = searchParams.get("caption") || "";
  const subtitle = searchParams.get("subtitle") || "";
  const imageUrl = searchParams.get("imageUrl") || "";
  const authorName = searchParams.get("authorName") || "";
  const authorImageUrl = searchParams.get("authorImageUrl") || "";

  const params = new URLSearchParams({
    title,
    subtitle,
    caption,
    textColor: theme.text.default,
    backgroundColor: theme.bg.primary,
    borderColor: theme.bg.default,
    url,
    authorName,
    authorImageUrl: authorImageUrl
      ? authorImageUrl.startsWith("http")
        ? authorImageUrl
        : new URL(authorImageUrl, url).toString()
      : "",
    imageUrl: imageUrl
      ? imageUrl.startsWith("http")
        ? imageUrl
        : new URL(imageUrl, url).toString()
      : "",
  });

  const image = await fetch(
    `https://next.guptasiddhant.com/api/og?${params.toString()}`,
  ).then((res) => res.blob());

  return new Response(image, {
    headers: {
      "Content-Type": "image/png",
      "Content-Length": image.size.toString(),
      "Cache-Control": "public, max-age=31536000",
    },
  });
}

export function CatchBoundary() {}
