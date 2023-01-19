import {
  LiveReload,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";

import usePullDownRefresh from "@gs/hooks/usePullDownRefresh";
import { getAboutInfo } from "@gs/models/about/index.server";
import { getNavigationRemoteConfig } from "@gs/navigation/service.server";
import { type RootLoaderData } from "@gs/root";
import AppLayout from "@gs/root/AppLayout";
import Document from "@gs/root/Document";
import { RootContext } from "@gs/root/RootContext";
import { CatchBoundary, ErrorBoundary } from "@gs/root/boundaries";
import links from "@gs/root/links";
import meta from "@gs/root/meta";
import { useLogPageViewEvent } from "@gs/service/analytics";
import { getAuthUser } from "@gs/service/auth.server";
import { getPwaFromRequest } from "@gs/service/pwa.server";
import { getThemeFromRequest } from "@gs/theme/cookie.server";
import type { ShouldRevalidateFunctionArgs } from "@gs/types";

export const loader: LoaderFunction = async ({ request }) => {
  const locale =
    request.headers.get("Accept-Language")?.split(",")[0] || "en-GB";

  const [about, navigationRemoteConfig, authUser, themeName, isPwa] =
    await Promise.all([
      getAboutInfo(),
      getNavigationRemoteConfig(),
      getAuthUser(request),
      getThemeFromRequest(request),
      getPwaFromRequest(request),
    ]);

  return json<RootLoaderData>({
    about,
    navigationRemoteConfig,
    isAuthenticated: !!authUser,
    themeName,
    locale,
    isPwa,
  });
};

export default function App() {
  const { themeName, locale } = useLoaderData<RootLoaderData>();

  usePullDownRefresh();
  useLogPageViewEvent();

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
  );
}

export { CatchBoundary, ErrorBoundary, links, meta };

// export const handle = {
//   breadcrumb: (match: MatchedCrumbProps<LoaderData>): JSX.Element => (
//     <Crumb match={match} className="font-bold">
//       {match.data.about.shortName || "GS"}
//     </Crumb>
//   ),
// }

export function shouldRevalidate(_: ShouldRevalidateFunctionArgs) {
  return true;
}
