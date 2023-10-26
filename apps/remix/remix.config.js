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
  serverModuleFormat: "cjs",
  // Features
  tailwind: true,

  // Feature flags
  // https://remix.run/docs/en/main/pages/api-development-strategy#current-future-flags
  future: {},

  // Custom routes
  // https://remix.run/docs/en/main/file-conventions/remix-config#routes
  ignoredRouteFiles: ["**/.*"],

  routes: () => {
    const adminRoutes = addRoutesFolder("admin", {
      appDirectory,
      ignoredRouteFiles: ["features/**"],
    });
    return adminRoutes;
  },
};
