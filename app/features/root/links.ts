import { type LinksFunction } from "@remix-run/server-runtime"

import fontStyles from "~/features/styles/font.css"
import globalStyles from "~/features/styles/global.css"
import prismRhemeStyles from "~/features/styles/prism-vscode-dark.css"
import reachMenuButtonStyles from "~/features/styles/reach-menu-button.css"
import tailwindStyles from "~/features/styles/tailwind.generated.css"

const links: LinksFunction = () => [
  {
    rel: "preload",
    as: "font",
    href: "https://fonts.gstatic.com/s/nunito/v20/XRXV3I6Li01BKofINeaBTMnFcQ.woff2",
    crossOrigin: "anonymous",
  },
  {
    rel: "preconnect",
    href: "https://firebasestorage.googleapis.com",
  },
  {
    rel: "apple-touch-icon",
    sizes: "180x180",
    href: "/favicon/apple-touch-icon.png",
  },
  {
    rel: "icon",
    type: "image/png",
    sizes: "32x32",
    href: "/favicon/favicon-32x32.png",
  },
  {
    rel: "icon",
    type: "image/png",
    sizes: "16x16",
    href: "/favicon/favicon-16x16.png",
  },
  { rel: "manifest", href: "/site.webmanifest" },
  { rel: "stylesheet", href: fontStyles },
  { rel: "stylesheet", href: "/theme.css" },
  { rel: "stylesheet", href: globalStyles },
  { rel: "stylesheet", href: tailwindStyles },
  { rel: "stylesheet", href: prismRhemeStyles },
  { rel: "stylesheet", href: reachMenuButtonStyles },
]

export default links