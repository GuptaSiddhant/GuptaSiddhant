import {
  json,
  type MetaFunction,
  type LinksFunction,
} from "@remix-run/server-runtime"
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react"
import clsx from "clsx"

import fontStyles from "~/styles/font.css"
import tailwindStyles from "~/styles/tailwind.css"
import prismRhemeStyles from "~/styles/prism-vscode-dark.css"

import AppLayout from "@gs/layouts/AppLayout"
import {
  Logo,
  getNavigationRemoteConfig,
  useNavigationLinks,
} from "./features/home/navigation"
import { type RootLoaderData } from "./features/home"

const intlListFormatPolyfillScript =
  "https://polyfill.io/v3/polyfill.min.js?features=Intl.ListFormat,Intl.ListFormat.~locale.en"

export default function App() {
  const navigationLinks = useNavigationLinks()

  return (
    <html
      lang="en"
      dir="ltr"
      className="text-[14px] sm:text-[16px] lg:text-[18px] m-0 p-0"
    >
      <head>
        <Meta />
        <Links />
        <script src={intlListFormatPolyfillScript} defer />
      </head>
      <body className={clsx("m-0 p-0", "bg-default text-default")}>
        <AppLayout logoElement={<Logo />} navigationLinks={navigationLinks}>
          <Outlet />
        </AppLayout>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  )
}

export async function loader() {
  const enabledNavigation = await getNavigationRemoteConfig()
  return json<RootLoaderData>({ ...enabledNavigation })
}

export const meta: MetaFunction = () => {
  const name = "Siddhant Gupta"

  return {
    title: name,
    description: "Webfolio of a developer/designer.",
    charset: "utf-8",
    viewport: "width=device-width,initial-scale=1.0,maximum-scale=1.0",
    "application-name": name,
    "apple-mobile-web-app-title": name,
    "theme-color": "#000000",
    "msapplication-TileColor": "#000000",
  }
}

export const links: LinksFunction = () => [
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
  { rel: "stylesheet", href: tailwindStyles },
  { rel: "stylesheet", href: prismRhemeStyles },
]
