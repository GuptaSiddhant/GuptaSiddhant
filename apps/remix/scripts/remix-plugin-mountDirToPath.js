const { defineRoutes } = require("@remix-run/dev/dist/config/routes");

/**
 * @param {string} dir Directory path relative to the app directory
 * @param {string=} path URL path to mount the directory to. If left undefined, the directory name will be used.
 * @return {import('@remix-run/dev/dist/config/routes').RouteManifest}
 */
function mountDirToPath(dir, path = dir) {
  return defineRoutes((route) =>
    route(path, `${dir}/_layout.tsx`, () => {
      route(undefined, `${dir}/_index.tsx`, { index: true });
      route("graphql", `${dir}/graphql.tsx`);
    }),
  );
}

module.exports = mountDirToPath;

/**
 *  {
  'admin/_layout': {
    path: 'admin',
    index: undefined,
    caseSensitive: undefined,
    id: 'admin/_layout',
    parentId: 'root',
    file: 'admin/_layout.tsx'
  },
  'admin/_index': {
    path: '_index',
    index: true,
    caseSensitive: undefined,
    id: 'admin/_index',
    parentId: 'admin/_layout',
    file: 'admin/_index.tsx'
  },
  'admin/graphql': {
    path: 'graphql',
    index: undefined,
    caseSensitive: undefined,
    id: 'admin/graphql',
    parentId: 'admin/_layout',
    file: 'admin/graphql.tsx'
  }
  }
 */
