/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  server: process.env.NODE_ENV === "development" ? undefined : "./server.js",
  serverBuildPath: "api/index.js",
  ignoredRouteFiles: ["**/.*"],
  appDirectory: "src",
  future: {
    v2_routeConvention: true,
    unstable_tailwind: true,
  },
};
