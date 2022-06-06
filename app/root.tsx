import {
  json,
  type MetaFunction,
  type LinksFunction,
} from "@remix-run/server-runtime"
import {
  LiveReload,
  Outlet,
  Scripts,
  ScrollRestoration,
  Links,
  useLoaderData,
  Meta,
  useCatch,
} from "@remix-run/react"

import fontStyles from "~/styles/font.css"
import tailwindStyles from "~/styles/tailwind.css"
import prismRhemeStyles from "~/styles/prism-vscode-dark.css"

import AppLayout from "~/packages/components/AppLayout"
import useNavigationLinks from "~/features/home/useNavigationLinks"
import { type RootLoaderData } from "~/features/home"
import {
  getAboutInfo,
  getNavigationRemoteConfig,
} from "~/features/home/service.server"
import Section from "./packages/components/Section"
import clsx from "clsx"
import type { ReactNode } from "react"
import CodeBlock from "./packages/components/CodeBlock"

export async function loader() {
  const about = await getAboutInfo()
  const navigationRemoteConfig = await getNavigationRemoteConfig()

  return json<RootLoaderData>({ about, navigationRemoteConfig })
}

export default function App() {
  const { navigationRemoteConfig } = useLoaderData<RootLoaderData>()
  const navigationLinks = useNavigationLinks(navigationRemoteConfig)

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

export const meta: MetaFunction = ({ data }: { data: RootLoaderData }) => {
  const { name = "Siddhant Gupta" } = data.about

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

// export const handle = {
//   breadcrumb: (match: MatchedCrumbProps<RootLoaderData>): JSX.Element => (
//     <Crumb match={match} className="font-bold">
//       {match.data.about.shortName || "GS"}
//     </Crumb>
//   ),
// }

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <Document error>
      <Section.Error
        logo
        caption={error.name}
        title="There was an error"
        description={error.message}
      >
        {error.stack && <CodeBlock>{error.stack}</CodeBlock>}
      </Section.Error>
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
      <Section.Error
        logo
        caption={`Error ${caught.status}`}
        title={heading}
        description={message}
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
      className="text-[14px] sm:text-[16px] lg:text-[18px] m-0 p-0"
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
