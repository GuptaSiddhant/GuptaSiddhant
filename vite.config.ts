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
