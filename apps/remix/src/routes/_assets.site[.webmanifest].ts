import type { LoaderArgs } from "@remix-run/server-runtime";

import { ONE_DAY_IN_S } from "@gs/constants";
import { getAboutInfo } from "@gs/models/about.server";
import { internalNavigationLinks } from "@gs/root/useNavigationLinks";
import { DEFAULT_THEME, getThemeFromThemeName } from "@gs/theme";
import type { WebApplicationManifest } from "@gs/types/webmanifest";

export async function loader({ request }: LoaderArgs): Promise<Response> {
  const [about] = await Promise.all([getAboutInfo()]);

  const origin = new URL(request.url).origin;
  const start_url = `${origin}?pwa`;

  const theme = getThemeFromThemeName(DEFAULT_THEME);
  const themeColor = theme.bg.default;

  const manifest: WebApplicationManifest = {
    id: "com.guptasiddhant.web",
    name: about.name,
    short_name: about.shortName,
    description: about.title,
    start_url,
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
  };

  return new Response(JSON.stringify(manifest, null, 2), {
    status: 200,
    headers: {
      "Content-Type": "manifest/json",
      "Cache-Control": ONE_DAY_IN_S.toString(),
    },
  });
}

export function CatchBoundary() {}
