import { type RouteConfig, route } from "@react-router/dev/routes";
import { flatRoutes } from "@react-router/fs-routes";

/**
 * Paths are resolved relative to `appDirectory` (src).
 * - `src/routes/*`: flat routes (Remix v2 flat-route naming), mounted at `/`.
 * - `src/admin/*`: flat routes nested under the `src/admin/__root.tsx` layout,
 *   mounted at `/admin`.
 */
export default [
  ...(await flatRoutes({ rootDirectory: "routes" })),
  route(
    "admin",
    "admin/__root.tsx",
    await flatRoutes({
      rootDirectory: "admin",
      ignoredRouteFiles: ["**/features/**", "**/__root.tsx"],
    }),
  ),
] satisfies RouteConfig;
