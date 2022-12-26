/**
 * @type {import('@remix-run/dev').AppConfig}
 */
module.exports = {
  serverBuildTarget: "vercel",
  // When running locally in development mode, we use the built in remix
  // server. This does not understand the vercel lambda module format,
  // so we default back to the standard build output.
  server: process.env.NODE_ENV === "development" ? undefined : "./server.js",
  ignoredRouteFiles: [".*"],
  appDirectory: "src",
  // serverBuildPath: "api/index.js",
  // assetsBuildDirectory: "public/build",
  // publicPath: "/build/",
  serverDependenciesToBundle: [/^rehype.*/, /^remark.*/, /^unified.*/, /^@gs/],
  cacheDirectory: "./node_modules/.cache/remix",
  // routes: (defineRoutes) => defineRoutes((route) => { route("/", "/x.tsx") }),
};
