import {
  LiveReload,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react"
import type { LoaderFunction } from "@remix-run/server-runtime"
import { json } from "@remix-run/server-runtime"

import { getAboutInfo } from "~/features/about/service.server"
import { getNavigationRemoteConfig } from "~/features/home/service.server"
import useNavigationLinks from "~/features/home/useNavigationLinks"
import { type RootLoaderData } from "~/features/root"
import { CatchBoundary, ErrorBoundary } from "~/features/root/boundaries"
import Document from "~/features/root/Document"
import links from "~/features/root/links"
import meta from "~/features/root/meta"
import { getAuthUser } from "~/features/service/auth.server"
import { checkIfDarkTheme } from "~/features/theme"
import { getThemeFromRequest } from "~/features/theme/cookie.server"
import AppLayout from "~/features/ui/AppLayout"

export const loader: LoaderFunction = async ({ request }) => {
  const [about, navigationRemoteConfig, authUser] = await Promise.all([
    getAboutInfo(),
    getNavigationRemoteConfig(),
    getAuthUser(request),
  ])

  const themeName = await getThemeFromRequest(request)

  return json<RootLoaderData>({
    about,
    navigationRemoteConfig,
    isAuthenticated: !!authUser,
    themeName,
  })
}

export default function App() {
  const { about, navigationRemoteConfig, isAuthenticated, themeName } =
    useLoaderData<RootLoaderData>()

  const navigationLinks = useNavigationLinks({
    about,
    navigationRemoteConfig,
    isAuthenticated,
    themeName,
  })

  return (
    <Document isDarkTheme={checkIfDarkTheme(themeName)}>
      <AppLayout navigationLinks={navigationLinks}>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </AppLayout>
    </Document>
  )
}

export { CatchBoundary, ErrorBoundary, links, meta }

// export const handle = {
//   breadcrumb: (match: MatchedCrumbProps<LoaderData>): JSX.Element => (
//     <Crumb match={match} className="font-bold">
//       {match.data.about.shortName || "GS"}
//     </Crumb>
//   ),
// }
