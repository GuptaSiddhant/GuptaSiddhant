import { Text, View } from "recanvas"

import type { LoaderFunction } from "@remix-run/server-runtime"

import recanvasRequest from "@gs/service/recanvas.server"
import { DEFAULT_THEME, getThemeFromThemeName } from "@gs/theme"

export const loader: LoaderFunction = async ({ request }) => {
  const { searchParams } = new URL(request.url)
  const theme = getThemeFromThemeName(DEFAULT_THEME)

  const title = searchParams.get("title")
  if (!title) return new Response("title is required", { status: 400 })

  const subtitle = searchParams.get("subtitle") ?? undefined
  const imageUrl = searchParams.get("imageUrl") ?? undefined

  const width = 800
  const height = width * (9 / 16)
  const color = theme.text.default
  const padding = 20

  const element = (
    <View
      style={{
        flexDirection: "row",
        paddingBottom: padding,
        paddingTop: padding,
        paddingRight: padding,
        paddingLeft: padding,
        ...({ backgroundColor: theme.bg.default } as any),
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
          ...({ backgroundColor: theme.bg.primary } as any),
        }}
      >
        <TitleView {...{ title, subtitle, color, padding }} />
        <AuthorView
          {...{ color, padding }}
          title="Siddhant Gupta"
          subtitle="guptasiddhant.com"
        />
      </View>

      <ImageView padding={padding} src={imageUrl} />
    </View>
  )

  return recanvasRequest(element, width, height)
}

export function CatchBoundary() {}

//

function TitleView({
  title,
  color,
  padding,
  subtitle,
}: {
  title: string
  subtitle?: string
  padding: number
  color: string
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
      <Text
        font={{
          size: 36,
          family: "Verdana" as any,
          weight: "bold" as any,
        }}
        style={{ flexGrow: 0, ...({ color } as any) }}
      >
        {title}
      </Text>
      {subtitle && (
        <Text
          font={{ size: 24, family: "Verdana" as any }}
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
}: {
  title: string
  subtitle: string
  padding: number
  color: string
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
          size: 24,
          family: "Verdana" as any,
          weight: "bold" as any,
        }}
        style={{ flexGrow: 0, ...({ color } as any) }}
      >
        {title}
      </Text>
      <Text
        font={{ size: 20, family: "Verdana" as any }}
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
}: {
  padding: number
  src?: string
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
        font={{ size: 20, family: "Verdana" as any }}
      >
        {src.replace(/\//g, "\n")}
      </Text>
    </View>
  )
}
