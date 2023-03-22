// @ts-check
const { addRoutesFolder } = require("remix-routes-folder");

const appDirectory = "src";

/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  server: process.env.NODE_ENV === "development" ? undefined : "./server.js",
  serverBuildPath: "api/index.js",
  ignoredRouteFiles: ["**/.*"],
  appDirectory,
  future: {
    v2_routeConvention: true,
    unstable_tailwind: true,
  },
  routes: () => addRoutesFolder("admin", { appDirectory }),
};
