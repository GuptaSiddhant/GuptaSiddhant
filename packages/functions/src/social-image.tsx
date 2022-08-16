import * as functions from "firebase-functions"
import { createElement } from "react"
import { View, Text, renderCanvas } from "recanvas"

export const socialImage = functions
  .region("europe-west1")
  .https.onRequest(createSocialImage)

async function createSocialImage(
  req: functions.https.Request,
  res: functions.Response,
) {
  const {
    title = "GS",
    subtitle,
    url,
    caption,
    imageUrl,
    textColor = "#ffffff",
    backgroundColor = "#171717",
    borderColor = "#000000",
  } = req.query
  const width = 800
  const height = width * (9 / 16)

  const element = createElement(SocialImage, {
    width,
    height,
    title: title.toString(),
    url: url?.toString(),
    caption: caption?.toString(),
    subtitle: subtitle?.toString(),
    imageUrl: imageUrl?.toString(),
    textColor: textColor.toString(),
    backgroundColor: backgroundColor.toString(),
    borderColor: borderColor.toString(),
  })

  const canvas = renderCanvas(
    element,
    {
      width,
      height,
    },
    {},
  )
  const buffer = canvas.toBuffer()

  res.writeHead(200, {
    "Content-type": "image/png",
    "Content-Length": Buffer.byteLength(buffer),
    width: canvas.width,
    height: canvas.height,
  })
  res.end(buffer)
}

interface SocialImageProps {
  title: string
  subtitle?: string
  caption?: string
  imageUrl?: string
  url?: string
  height: number
  width: number
  textColor: string
  backgroundColor: string
  borderColor: string
}

function SocialImage({
  title,
  subtitle,
  url,
  caption,
  imageUrl,
  width,
  textColor,
  backgroundColor,
  borderColor,
}: SocialImageProps): JSX.Element {
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
        {url && (
          <AuthorView
            {...{ color, padding, fontSize }}
            title="Siddhant Gupta"
            subtitle={url}
          />
        )}
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
