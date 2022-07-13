import { getAboutInfo } from "@gs/about/service.server"
import { internalNavigationLinks } from "@gs/navigation/useNavigationLinks"
import { DEFAULT_THEME, getThemeFromThemeName } from "@gs/theme"
import type { WebApplicationManifest } from "@gs/types/webmanifest"
import type { LoaderFunction } from "@remix-run/server-runtime"

export const loader: LoaderFunction = async ({ request }) => {
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
      //   {
      //     src: "/favicon/android-chrome-192x192.png",
      //     sizes: "192x192",
      //     type: "image/png",
      //   },
      //   {
      //     src: "/favicon/android-chrome-384x384.png",
      //     sizes: "384x384",
      //     type: "image/png",
      //     purpose: "any maskable",
      //   },
      //   {
      //     src: "/favicon/android-chrome-384x384.png",
      //     sizes: "512x512",
      //     type: "image/png",
      //   },
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
