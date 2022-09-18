import type { LoaderArgs } from "@remix-run/server-runtime"

import { getAboutInfo } from "@gs/models/about/index.server"
import { internalNavigationLinks } from "@gs/navigation/useNavigationLinks"
import { DEFAULT_THEME, getThemeFromThemeName } from "@gs/theme"
import type { WebApplicationManifest } from "@gs/types/webmanifest"

export async function loader(_: LoaderArgs): Promise<Response> {
  const [about] = await Promise.all([getAboutInfo()])

  const theme = getThemeFromThemeName(DEFAULT_THEME)
  const themeColor = theme.bg.default

  const manifest: WebApplicationManifest = {
    name: about.name,
    short_name: about.shortName,
    description: about.title,
    start_url: ".",
    scope: ".",
    theme_color: themeColor,
    background_color: themeColor,
    display: "standalone",
    dir: "ltr",
    lang: "en-GB",
    orientation: "portrait-primary",
    icons: [
      {
        src: "/assets/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/assets/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    shortcuts: [
      {
        name: "Admin",
        url: "/admin",
        description: "GS Admin",
      },
      ...internalNavigationLinks.map((link) => ({
        name: link.children?.toString() || link.id,
        url: link.to?.toString() || "/",
      })),
    ],
  }

  return new Response(JSON.stringify(manifest, null, 2), {
    status: 200,
    headers: { "Content-Type": "manifest/json" },
  })
}

export function CatchBoundary() {}
