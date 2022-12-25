import type { NextRequest } from "next/server";
import { ImageResponse } from "@vercel/og";
import type { SatoriOptions } from "satori";

export const config = {
  runtime: "edge",
};

const DEFAULT_WIDTH = 800;
const DEFAULT_RATIO = 16 / 9;
const DEFAULT_SPACING = DEFAULT_WIDTH / 40;
const DEFAULT_BORDER_WIDTH = DEFAULT_SPACING;
const DEFAULT_FONT_SIZE = DEFAULT_SPACING;
const DEFAULT_TEXT_COLOR = "#FFFFFF";
const DEFAULT_BG_COLOR = "#171717";
const DEFAULT_BORDER_COLOR = "#000000";

const nunitoRegularFontBuffer = fetch(
  new URL("../../public/Nunito-Regular.ttf", import.meta.url),
).then((res) => res.arrayBuffer());
const nunitoBoldFontBuffer = fetch(
  new URL("../../public/Nunito-Bold.ttf", import.meta.url),
).then((res) => res.arrayBuffer());

export default async function handler(req: NextRequest) {
  if (!req.url) {
    return new Response("Server error. URL not found.", { status: 500 });
  }

  const { searchParams } = new URL(req.url);
  const title = searchParams.get("title");

  if (!title) {
    return new Response("Query param 'title' is required.", { status: 400 });
  }

  const width = Number(searchParams.get("width") ?? DEFAULT_WIDTH);
  const ratio = Number(searchParams.get("ratio") ?? DEFAULT_RATIO);
  const height = Number(searchParams.get("height") ?? width / ratio);

  const subtitle = searchParams.get("subtitle") ?? undefined;
  const caption = searchParams.get("caption") ?? undefined;
  const imageUrl = searchParams.get("imageUrl") ?? undefined;
  const authorName = searchParams.get("authorName") ?? undefined;
  const authorImageUrl = searchParams.get("authorImageUrl") ?? undefined;

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

function OGImage({
  title,
  caption,
  subtitle,
  style,
  imageUrl,
  imageAlt,
  author,
}: {
  style?: React.CSSProperties;
  imageUrl?: string;
  imageAlt?: string;
  caption?: string;
  subtitle?: string;
  author?: { name: string; imageUrl?: string };
  title: string;
}): JSX.Element {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        background: DEFAULT_BG_COLOR,
        borderRadius: DEFAULT_SPACING,
        borderColor: DEFAULT_BORDER_COLOR,
        borderWidth: DEFAULT_BORDER_WIDTH,
        color: DEFAULT_TEXT_COLOR,
        fontSize: DEFAULT_FONT_SIZE,
        fontFamily: "Nunito",
        ...style,
      }}
    >
      <main
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          padding: DEFAULT_SPACING,
          height: "100%",
        }}
      >
        <header
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            fontWeight: 700,
          }}
        >
          <img
            src="https://guptasiddhant.com/assets/GS-white.png"
            alt="GS"
            style={{
              width: DEFAULT_SPACING * 2,
              height: DEFAULT_SPACING * 2,
              objectFit: "contain",
              marginRight: DEFAULT_SPACING,
            }}
          />
          <span>GuptaSiddhant.com</span>
        </header>

        <div
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          {caption && (
            <div
              style={{
                display: "flex",
                fontWeight: 700,
                textTransform: "uppercase",
              }}
            >
              {caption}
            </div>
          )}
          <div
            style={{
              display: "flex",
              fontSize: DEFAULT_FONT_SIZE * 2,
              fontWeight: 700,
            }}
          >
            {title}
          </div>
          {subtitle && (
            <div
              style={{
                display: "flex",
                fontWeight: 700,
                marginTop: DEFAULT_SPACING,
                opacity: 0.8,
                textOverflow: "ellipsis",
              }}
            >
              {subtitle}
            </div>
          )}
        </div>
        {author ? (
          <footer
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            {author.imageUrl && (
              <img
                src={author.imageUrl}
                alt={author.name}
                style={{
                  width: DEFAULT_SPACING * 2,
                  height: DEFAULT_SPACING * 2,
                  borderRadius: DEFAULT_SPACING,
                  objectFit: "cover",
                  marginRight: DEFAULT_SPACING,
                }}
              />
            )}
            <span>By {author.name}</span>
          </footer>
        ) : null}
      </main>

      {imageUrl && (
        <img
          style={{
            objectFit: "cover",
            width: "100%",
            height: "100%",
            flex: 1,
            borderTopRightRadius: DEFAULT_SPACING / 2,
            borderBottomRightRadius: DEFAULT_SPACING / 2,
          }}
          src={imageUrl}
          alt={imageAlt}
        />
      )}
    </div>
  );
}
