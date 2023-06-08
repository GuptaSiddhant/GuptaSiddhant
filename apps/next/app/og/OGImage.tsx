/* eslint-disable @next/next/no-img-element */

export const DEFAULT_WIDTH = 800;
export const DEFAULT_RATIO = 16 / 9;
export const DEFAULT_SPACING = DEFAULT_WIDTH / 40;
export const DEFAULT_BORDER_WIDTH = DEFAULT_SPACING;
export const DEFAULT_FONT_SIZE = DEFAULT_SPACING;
export const DEFAULT_TEXT_COLOR = "#FFFFFF";
export const DEFAULT_BG_COLOR = "#171717";
export const DEFAULT_BORDER_COLOR = "#000000";

interface OGImageProps {
  style?: React.CSSProperties;
  imageUrl?: string;
  imageAlt?: string;
  caption?: string;
  subtitle?: string;
  author?: { name: string; imageUrl?: string };
  title: string;
}

export default function OGImage({
  title,
  caption,
  subtitle,
  style,
  imageUrl,
  imageAlt,
  author,
}: OGImageProps): JSX.Element {
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
