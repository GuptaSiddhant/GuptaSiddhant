import type { MetaFunction, LinksFunction } from "@remix-run/server-runtime"
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react"
import clsx from "clsx"
import { useMemo } from "react"
import GithubIcon from "remixicon-react/GithubFillIcon"
import LinkedinIcon from "remixicon-react/LinkedinBoxFillIcon"
import SearchIcon from "remixicon-react/Search2LineIcon"

import fontStyles from "~/styles/font.css"
import tailwindStyles from "~/styles/tailwind.css"
import prismRhemeStyles from "~/styles/prism-vscode-dark.css"

import AppLayout, { type AppLayoutProps } from "@gs/layouts/AppLayout"

const intlListFormatPolyfillScript =
  "https://polyfill.io/v3/polyfill.min.js?features=Intl.ListFormat,Intl.ListFormat.~locale.en"

export default function App() {
  const navigationLinks: AppLayoutProps["navigationLinks"] = useMemo(
    () => [
      { id: "about", to: "/about", children: "About" },
      { id: "projects", to: "/projects", children: "Projects" },
      { id: "blog", to: "/blog", children: "Blog" },
      {
        id: "GitHub",
        to: "https://",
        children: <GithubIcon />,
      },
      {
        id: "LinkedIn",
        to: "https://",
        children: <LinkedinIcon />,
      },
      {
        id: "Search",
        onClick: () => {},
        children: <SearchIcon />,
      },
    ],
    [],
  )

  return (
    <html lang="en">
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

function Logo(): JSX.Element | null {
  return (
    <span
      role="presentation"
      className={
        "text-xl font-black uppercase leading-normal tracking-widest text-primary"
      }
    >
      Siddhant Gupta
    </span>
  )
}
