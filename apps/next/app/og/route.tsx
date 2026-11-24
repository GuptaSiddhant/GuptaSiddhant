import OGImage, { DEFAULT_RATIO, DEFAULT_WIDTH } from "./OGImage";
import { ImageResponse } from "@vercel/og";
import type { SatoriOptions } from "satori";

export const runtime = "edge";

const MIN_SIZE = 200;
const MAX_SIZE = 2400;

const ALLOWED_IMAGE_HOSTS = new Set([
  "guptasiddhant.com",
  "www.guptasiddhant.com",
  "next.guptasiddhant.com",
  "res.cloudinary.com",
  "firebasestorage.googleapis.com",
  "storage.googleapis.com",
]);

const nunitoRegularFontBuffer = fetch(
  new URL("../../public/Nunito-Regular.ttf", import.meta.url),
).then((res) => res.arrayBuffer());
const nunitoBoldFontBuffer = fetch(
  new URL("../../public/Nunito-Bold.ttf", import.meta.url),
).then((res) => res.arrayBuffer());

/** Parses a size param as an integer clamped to [MIN_SIZE, MAX_SIZE]. */
function parseSize(value: string | null, fallback: number): number {
  const num = Number(value ?? fallback);
  if (!Number.isFinite(num)) return fallback;
  return Math.min(MAX_SIZE, Math.max(MIN_SIZE, Math.round(num)));
}

/**
 * Resolves an image URL against the page URL. Throws on malformed input,
 * returns undefined for URLs that are not https or not on the allowlist.
 */
function parseImageUrl(
  value: string | null,
  base?: string,
): string | undefined {
  if (!value) return undefined;
  const parsed = new URL(value, base);
  if (
    parsed.protocol !== "https:" ||
    parsed.port !== "" ||
    !ALLOWED_IMAGE_HOSTS.has(parsed.hostname)
  ) {
    return undefined;
  }
  return parsed.toString();
}

function parseParams(requestUrl: string) {
  const { searchParams } = new URL(requestUrl);

  const title = searchParams.get("title");
  if (!title) {
    throw new Error("Query param 'title' is required.");
  }

  const url = searchParams.get("url") ?? undefined;

  const ratio = Number(searchParams.get("ratio") ?? DEFAULT_RATIO);
  const validRatio =
    Number.isFinite(ratio) && ratio > 0 ? ratio : DEFAULT_RATIO;

  const width = parseSize(searchParams.get("width"), DEFAULT_WIDTH);
  const height = parseSize(
    searchParams.get("height"),
    Math.round(width / validRatio),
  );

  const authorName = searchParams.get("authorName") ?? undefined;

  return {
    title,
    width,
    height,
    url,
    subtitle: searchParams.get("subtitle") ?? undefined,
    caption: searchParams.get("caption") ?? undefined,
    authorName,
    imageUrl: parseImageUrl(searchParams.get("imageUrl"), url),
    authorImageUrl: parseImageUrl(searchParams.get("authorImageUrl"), url),
  };
}

export async function GET(request: Request) {
  if (!request.url) {
    return new Response("Server error. URL not found.", { status: 500 });
  }

  let params: ReturnType<typeof parseParams>;
  try {
    params = parseParams(request.url);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Invalid query params.";
    return new Response(message, { status: 400 });
  }

  const {
    title,
    width,
    height,
    subtitle,
    caption,
    authorName,
    imageUrl,
    authorImageUrl,
  } = params;

  // Fonts
  const [nunitoRegularFontData, nunitoBoldFontData] = await Promise.all([
    nunitoRegularFontBuffer,
    nunitoBoldFontBuffer,
  ]);
  const fonts: SatoriOptions["fonts"] = [
    {
      name: "Nunito",
      data: nunitoRegularFontData,
      style: "normal",
      weight: 400,
    },
    {
      name: "Nunito",
      data: nunitoBoldFontData,
      style: "normal",
      weight: 700,
    },
  ];

  try {
    return new ImageResponse(
      <OGImage
        imageUrl={imageUrl}
        caption={caption}
        subtitle={subtitle}
        title={title}
        author={
          authorName
            ? { name: authorName, imageUrl: authorImageUrl }
            : undefined
        }
      />,
      {
        width,
        height,
        fonts,
        headers: {
          "Cache-Control":
            "public, max-age=86400, s-maxage=604800, immutable",
        },
      },
    );
  } catch (error) {
    if (error instanceof Error) {
      console.log(`${error.message}`);
    }

    return new Response("Failed to generate the image", {
      status: 500,
    });
  }
}
