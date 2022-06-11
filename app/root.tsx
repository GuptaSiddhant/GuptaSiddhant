import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useCatch,
  useLoaderData,
} from "@remix-run/react"
import {
  type LinksFunction,
  type MetaFunction,
  json,
} from "@remix-run/server-runtime"
import clsx from "clsx"
import type { ReactNode } from "react"

import { type AboutInfo } from "~/features/about"
import { getAboutInfo } from "~/features/about/service.server"
import {
  type NavigationRemoteConfig,
  getNavigationRemoteConfig,
} from "~/features/home/service.server"
import useNavigationLinks from "~/features/home/useNavigationLinks"
import CodeBlock from "~/packages/components/CodeBlock"
import { ErrorPage } from "~/packages/components/Error"
import AppLayout from "~/packages/layouts/AppLayout"
import fontStyles from "~/packages/styles/font.css"
import globalStyles from "~/packages/styles/global.css"
import prismRhemeStyles from "~/packages/styles/prism-vscode-dark.css"
import tailwindStyles from "~/packages/styles/tailwind.css"

interface LoaderData {
  about: AboutInfo
  navigationRemoteConfig: NavigationRemoteConfig
}

export async function loader() {
  const [about, navigationRemoteConfig] = await Promise.all([
    getAboutInfo(),
    getNavigationRemoteConfig(),
  ])

  return json<LoaderData>({ about, navigationRemoteConfig })
}

export default function App() {
  const { about, navigationRemoteConfig } = useLoaderData<LoaderData>()
  const navigationLinks = useNavigationLinks(about, navigationRemoteConfig)

  return (
    <Document>
      <AppLayout navigationLinks={navigationLinks}>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </AppLayout>
    </Document>
  )
}

export const meta: MetaFunction = ({ data }: { data: LoaderData }) => {
  const { name = "Siddhant Gupta" } = data.about

  return {
    title: name,
    description: "Webfolio of a creator.",
    charset: "utf-8",
    viewport: "width=device-width,initial-scale=1.0,maximum-scale=1.0",
    "application-name": name,
    "apple-mobile-web-app-title": name,
    "theme-color": "#000000",
    "msapplication-TileColor": "#000000",
    "og:locale": "en_GB",
    "og:type": "website",
    "og:site_name": "GS",
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
  { rel: "stylesheet", href: globalStyles },
  { rel: "stylesheet", href: tailwindStyles },
  { rel: "stylesheet", href: prismRhemeStyles },
]

// export const handle = {
//   breadcrumb: (match: MatchedCrumbProps<LoaderData>): JSX.Element => (
//     <Crumb match={match} className="font-bold">
//       {match.data.about.shortName || "GS"}
//     </Crumb>
//   ),
// }

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <Document error>
      <ErrorPage caption={error.name} message={error.message}>
        {error.stack && <CodeBlock>{error.stack}</CodeBlock>}
      </ErrorPage>
    </Document>
  )
}

export function CatchBoundary() {
  const caught = useCatch()

  let message
  switch (caught.status) {
    case 401:
      message =
        "Oops! Looks like you tried to visit a page that you do not have access to."
      break
    case 404:
      message =
        "Oops! Looks like you tried to visit a page that does not exist."
      break
    default:
      throw new Error(caught.data || caught.statusText)
  }

  const heading = `${caught.status}: ${caught.statusText}`

  return (
    <Document error>
      <ErrorPage
        caption={`Error ${caught.status}`}
        title={heading}
        message={message}
      />
    </Document>
  )
}

function Document({
  children,
  error,
}: {
  children: ReactNode
  error?: boolean
}): JSX.Element | null {
  const intlListFormatPolyfillScript =
    "https://polyfill.io/v3/polyfill.min.js?features=Intl.ListFormat,Intl.ListFormat.~locale.en"

  return (
    <html
      lang="en"
      dir="ltr"
      className="dark text-[14px] sm:text-[16px] lg:text-[18px] m-0 p-0"
    >
      <head>
        {error ? null : <Meta />}
        <Links />
        {error ? null : <script src={intlListFormatPolyfillScript} defer />}
      </head>
      <body className={clsx("m-0 p-0", "bg-default text-default")}>
        {children}
      </body>
    </html>
  )
}
