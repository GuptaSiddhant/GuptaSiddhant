import type { ShouldReloadFunction } from "@remix-run/react"
import {
  LiveReload,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react"
import type { LoaderFunction } from "@remix-run/server-runtime"
import { json } from "@remix-run/server-runtime"

import usePullDownRefresh from "@gs/hooks/usePullDownRefresh"
import { getAboutInfo } from "@gs/models/about.server"
import { getNavigationRemoteConfig } from "@gs/navigation/service.server"
import { type RootLoaderData } from "@gs/root"
import AppLayout from "@gs/root/AppLayout"
import { CatchBoundary, ErrorBoundary } from "@gs/root/boundaries"
import Document from "@gs/root/Document"
import links from "@gs/root/links"
import meta from "@gs/root/meta"
import { RootContext } from "@gs/root/RootContext"
import { getAuthUser } from "@gs/service/auth.server"
import { getThemeFromRequest } from "@gs/theme/cookie.server"

export const loader: LoaderFunction = async ({ request }) => {
  const themeName = await getThemeFromRequest(request)
  const locale =
    request.headers.get("Accept-Language")?.split(",")[0] || "en-GB"

  const [about, navigationRemoteConfig, authUser] = await Promise.all([
    getAboutInfo(),
    getNavigationRemoteConfig(),
    getAuthUser(request),
  ])

  return json<RootLoaderData>({
    about,
    navigationRemoteConfig,
    isAuthenticated: !!authUser,
    themeName,
    locale,
  })
}

export default function App() {
  const { themeName, locale } = useLoaderData<RootLoaderData>()
  usePullDownRefresh()

  return (
    <RootContext.Provider value={{ themeName, locale }}>
      <Document themeName={themeName}>
        <AppLayout>
          <Outlet />
          <ScrollRestoration />
          <Scripts />
          <LiveReload />
        </AppLayout>
      </Document>
    </RootContext.Provider>
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

export const unstable_shouldReload: ShouldReloadFunction = () => false
