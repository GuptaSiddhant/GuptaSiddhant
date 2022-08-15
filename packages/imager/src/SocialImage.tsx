import { Text, View } from "recanvas"

export interface SocialImageProps {
  title: string
  url: string
  subtitle?: string
  caption?: string
  imageUrl?: string
  height: number
  width: number
  textColor: string
  backgroundColor: string
  borderColor: string
}

export default function SocialImage({
  title,
  subtitle,
  url,
  caption,
  imageUrl,
  width,
  textColor,
  backgroundColor,
  borderColor,
}: SocialImageProps) {
  const color = textColor
  const padding = width / 40
  const fontSize = width / 40

  return (
    <View
      style={{
        flexDirection: "row",
        paddingBottom: padding,
        paddingTop: padding,
        paddingRight: padding,
        paddingLeft: padding,
        ...({ backgroundColor: borderColor } as any),
      }}
    >
      <View
        style={{
          flexDirection: "column",
          justifyContent: "space-between",
          paddingBottom: padding,
          paddingTop: padding,
          paddingRight: padding,
          paddingLeft: padding,
          width: "60%",
          ...({ backgroundColor } as any),
        }}
      >
        <TitleView
          {...{ caption, title, subtitle, color, padding, fontSize }}
        />
        <AuthorView
          {...{ color, padding, fontSize }}
          title="Siddhant Gupta"
          subtitle={url}
        />
      </View>

      <ImageView padding={padding} src={imageUrl} fontSize={fontSize} />
    </View>
  )
}

function TitleView({
  title,
  color,
  padding,
  subtitle,
  fontSize,
  caption,
}: {
  title: string
  subtitle?: string
  padding: number
  color: string
  fontSize: number
  caption?: string
}) {
  return (
    <View
      style={{
        flexDirection: "column",
        justifyContent: "flex-start",
        paddingBottom: padding,
        paddingTop: padding,
        paddingRight: padding,
        paddingLeft: padding,
      }}
    >
      {caption && (
        <Text
          font={{
            size: fontSize,
            family: "Verdana" as any,
            weight: "bold" as any,
          }}
          style={{ flexGrow: 0, ...({ color } as any) }}
        >
          {caption.toUpperCase()}
        </Text>
      )}
      <Text
        font={{
          size: fontSize * 1.8,
          family: "Verdana" as any,
          weight: "bold" as any,
        }}
        style={{ flexGrow: 0, marginTop: padding, ...({ color } as any) }}
      >
        {title}
      </Text>
      {subtitle && (
        <Text
          font={{ size: fontSize, family: "Verdana" as any }}
          style={{ flexGrow: 0, marginTop: padding, ...({ color } as any) }}
        >
          {subtitle}
        </Text>
      )}
    </View>
  )
}

function AuthorView({
  title,
  color,
  padding,
  subtitle,
  fontSize,
}: {
  title: string
  subtitle: string
  padding: number
  color: string
  fontSize: number
}) {
  return (
    <View
      style={{
        flexDirection: "column",
        justifyContent: "flex-end",
        paddingBottom: padding,
        paddingTop: padding,
        paddingRight: padding,
        paddingLeft: padding,
      }}
    >
      <Text
        font={{
          size: fontSize * 1.1,
          family: "Verdana" as any,
          weight: "bold" as any,
        }}
        style={{ flexGrow: 0, ...({ color } as any) }}
      >
        {title}
      </Text>
      <Text
        font={{ size: fontSize * 0.9, family: "Verdana" as any }}
        style={{ flexGrow: 0, ...({ color } as any) }}
      >
        {subtitle}
      </Text>
    </View>
  )
}

function ImageView({
  padding,
  src,
  fontSize,
}: {
  padding: number
  src?: string
  fontSize: number
}): JSX.Element | null {
  if (!src) return null

  return (
    <View
      style={{
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        paddingBottom: padding,
        paddingTop: padding,
        paddingRight: padding,
        paddingLeft: padding,
        width: "40%",
      }}
    >
      <Text
        style={{ flexGrow: 0 }}
        font={{ size: fontSize, family: "Verdana" as any }}
      >
        {src.replace(/\//g, "\n")}
      </Text>
    </View>
  )
}
