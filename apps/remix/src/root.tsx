import {
  LiveReload,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import { type DataFunctionArgs, json } from "@remix-run/server-runtime";

import usePullDownRefresh from "@gs/hooks/usePullDownRefresh";
import { getAboutInfo } from "@gs/models/about.server";
import { type RootLoaderData } from "@gs/root";
import AppLayout from "@gs/root/AppLayout";
import Document from "@gs/root/Document";
import { RootContext } from "@gs/root/RootContext";
import ErrorBoundary from "@gs/root/RootErrorBoundary";
import links from "@gs/root/links";
import meta from "@gs/root/meta";
import { getNavigationRemoteConfig } from "@gs/root/service.server";
import { useLogPageViewEvent } from "@gs/service/analytics";
import { getAuthUser } from "@gs/service/auth.server";
import { getPwaFromRequest } from "@gs/service/pwa.server";
import { getThemeFromRequest } from "@gs/theme/cookie.server";
import type { ShouldRevalidateFunctionArgs } from "@gs/types";

export async function loader({ request }: DataFunctionArgs) {
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
}

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

export { ErrorBoundary, links, meta };

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
