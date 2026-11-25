import { defineConfig } from "vite-plus";

export default defineConfig({
  // Oxlint (replaces Rome linter)
  lint: {
    plugins: ["typescript", "react", "jsx-a11y"],
    ignorePatterns: [
      "**/build/**",
      "**/.react-router/**",
      "**/public/**",
      "**/.next/**",
      "**/lib/**",
      "**/bin/**",
      "backup/**",
      "**/*.generated.*",
    ],
    rules: {
      "jsx-a11y/click-events-have-key-events": "off",
      "react/exhaustive-deps": "warn",
      "no-var": "error",
      "react/jsx-no-useless-fragment": "warn",
      "typescript/no-explicit-any": "warn",
      "no-unused-vars": "warn",
    },
  },
  // Oxfmt (replaces Rome formatter and Prettier)
  fmt: {
    sortPackageJson: false,
    useTabs: false,
    tabWidth: 2,
    printWidth: 80,
    singleQuote: false,
    semi: true,
    trailingComma: "all",
    quoteProps: "as-needed",
    ignorePatterns: [
      "**/build/**",
      "**/.react-router/**",
      "**/public/**",
      "**/.next/**",
      "**/lib/**",
      "**/bin/**",
      "backup/**",
      "pnpm-lock.yaml",
      "**/*.generated.*",
      // Only code is format-checked for now (Rome never formatted these).
      "**/*.{css,html,json,jsonc,yaml,yml,md,mdx,code-snippets}",
      // TODO: Files that predate Oxfmt and differ from its output (Rome-style
      // formatting). Run `vp fmt` on them and drop them from this list.
      "apps/cli/scripts/react_shim.js",
      "apps/cli/src/components/Item.tsx",
      "apps/functions/src/firestore.ts",
      "apps/functions/src/update-index.ts",
      "apps/next/app/layout.tsx",
      "apps/remix/.storybook/decorators/theme.tsx",
      "apps/remix/src/admin/features/editor/EditorForm/helpers.tsx",
      "apps/remix/src/admin/logs.$name.tsx",
      "apps/remix/src/features/firebase/firestore.ts",
      "apps/remix/src/features/firebase/remote-config.ts",
      "apps/remix/src/features/hooks/useFullscreen.ts",
      "apps/remix/src/features/models/projects.server.ts",
      "apps/remix/src/features/resume/components/ResumeHero.tsx",
      "apps/remix/src/features/resume/helpers.ts",
      "apps/remix/src/features/resume/theme.ts",
      "apps/remix/src/features/root/service.server.ts",
      "apps/remix/src/features/summary/helpers.ts",
      "apps/remix/src/features/ui/Table.tsx",
      "apps/remix/src/features/utils/error.ts",
      "apps/remix/src/routes/about.tsx",
      "scripts/about-info.js",
      "scripts/db-backup.js",
      "scripts/db-restore.js",
      "scripts/firebase.js",
      "scripts/skills.js",
      "scripts/utils.js",
    ],
    overrides: [
      {
        // The CLI app is written without semicolons.
        files: ["apps/cli/**"],
        options: { semi: false },
      },
    ],
  },
});
