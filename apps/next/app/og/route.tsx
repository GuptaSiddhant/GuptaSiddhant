import OGImage, { DEFAULT_RATIO, DEFAULT_WIDTH } from "./OGImage";
import { ImageResponse } from "@vercel/og";
import type { SatoriOptions } from "satori";

export const runtime = "edge";

const nunitoRegularFontBuffer = fetch(
  new URL("../../public/Nunito-Regular.ttf", import.meta.url),
).then((res) => res.arrayBuffer());
const nunitoBoldFontBuffer = fetch(
  new URL("../../public/Nunito-Bold.ttf", import.meta.url),
).then((res) => res.arrayBuffer());

export async function GET(request: Request) {
  if (!request.url) {
    return new Response("Server error. URL not found.", { status: 500 });
  }

  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title");

  if (!title) {
    return new Response("Query param 'title' is required.", { status: 400 });
  }

  const width = Number(searchParams.get("width") ?? DEFAULT_WIDTH);
  const ratio = Number(searchParams.get("ratio") ?? DEFAULT_RATIO);
  const height = Number(searchParams.get("height") ?? width / ratio);

  const url = searchParams.get("url") ?? undefined;
  const subtitle = searchParams.get("subtitle") ?? undefined;
  const caption = searchParams.get("caption") ?? undefined;
  const authorName = searchParams.get("authorName") ?? undefined;

  const _imageUrl = searchParams.get("imageUrl") ?? undefined;
  const imageUrl = _imageUrl ? new URL(_imageUrl, url).toString() : undefined;

  const _authorImageUrl = searchParams.get("authorImageUrl") ?? undefined;
  const authorImageUrl = _authorImageUrl
    ? new URL(_authorImageUrl, url).toString()
    : undefined;

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
