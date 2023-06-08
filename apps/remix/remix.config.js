// @ts-check
const { addRoutesFolder } = require("remix-routes-folder");

const appDirectory = "src";

/**
 * Remix App Config
 * https://remix.run/docs/en/main/file-conventions/remix-config
 * @type {import('@remix-run/dev').AppConfig}
 */
module.exports = {
  appDirectory,

  // Vercel
  // https://remix.run/docs/en/main/pages/v2#vercel
  publicPath: "/build/",
  serverBuildPath: "api/index.js",
  serverMainFields: ["main", "module"],
  serverModuleFormat: "cjs",
  serverPlatform: "node",
  serverMinify: false,

  // Features
  tailwind: true,

  // Feature flags
  // https://remix.run/docs/en/main/pages/api-development-strategy#current-future-flags
  future: {
    v2_errorBoundary: true,
    v2_headers: true,
    v2_meta: true,
    v2_normalizeFormMethod: true,
    v2_routeConvention: true,
    unstable_dev: true,
  },

  // Custom routes
  // https://remix.run/docs/en/main/file-conventions/remix-config#routes
  ignoredRouteFiles: ["**/.*"],
  routes: () => {
    const adminRoutes = addRoutesFolder("admin", {
      appDirectory,
      ignoredRouteFiles: ["features/**"],
    });

    return { ...adminRoutes };
  },
};
