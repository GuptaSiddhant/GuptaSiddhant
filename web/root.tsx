import { getAboutInfo } from "@gs/about/service.server"
import { getNavigationRemoteConfig } from "@gs/navigation/service.server"
import useNavigationLinks from "@gs/navigation/useNavigationLinks"
import { type RootLoaderData } from "@gs/root"
import AppLayout from "@gs/root/AppLayout"
import { CatchBoundary, ErrorBoundary } from "@gs/root/boundaries"
import Document from "@gs/root/Document"
import links from "@gs/root/links"
import meta from "@gs/root/meta"
import { getAuthUser } from "@gs/service/auth.server"
import { getThemeFromRequest } from "@gs/theme/cookie.server"
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

export const loader: LoaderFunction = async ({ request }) => {
  const themeName = await getThemeFromRequest(request)
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
  })
}

export default function App() {
  const { themeName } = useLoaderData<RootLoaderData>()

  return (
    <Document themeName={themeName}>
      <AppLayout>
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

export const unstable_shouldReload: ShouldReloadFunction = () => false
