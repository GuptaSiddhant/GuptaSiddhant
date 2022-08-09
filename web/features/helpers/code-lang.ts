import clsx from "clsx"
import { type Language } from "prism-react-renderer"

interface SupportedLanguageProperties {
  lang: Language
  label?: string
  className?: string
}

const javascriptClassName = clsx("bg-yellow-400 dark:bg-yellow-700")
const typescriptClassName = clsx("bg-blue-300 dark:bg-blue-700")

export const supportedLanguages: SupportedLanguageProperties[] = [
  { lang: "markup" },
  { lang: "bash" },
  { lang: "clike" },
  { lang: "c" },
  { lang: "cpp" },
  { lang: "css" },
  {
    lang: "javascript",
    className: javascriptClassName,
    label: "JS",
  },
  { lang: "jsx", className: javascriptClassName },
  { lang: "coffeescript" },
  { lang: "actionscript" },
  { lang: "css-extr" },
  { lang: "diff" },
  { lang: "git" },
  { lang: "go" },
  { lang: "graphql" },
  { lang: "handlebars" },
  { lang: "json" },
  { lang: "less" },
  { lang: "makefile" },
  { lang: "markdown" },
  { lang: "objectivec" },
  { lang: "ocaml" },
  { lang: "python" },
  { lang: "reason" },
  { lang: "sass" },
  { lang: "scss" },
  { lang: "sql" },
  { lang: "stylus" },
  { lang: "tsx", className: typescriptClassName },
  {
    lang: "typescript",
    className: typescriptClassName,
    label: "TS",
  },
  { lang: "wasm" },
  { lang: "yaml" },
]

export function getLanguageBadgeProperties(
  language: Language,
): SupportedLanguageProperties | undefined {
  return supportedLanguages.find(({ lang }) => lang === language)
}

export function isLanguageSupported(language: string): boolean {
  return supportedLanguages
    .map(({ lang }) => lang)
    .includes(language as Language)
}

export function getLanguageFromClassName(className: string): Language {
  const match = className.match(/lang-(\w+)/)
  const lang = match ? match[1] : ""

  return isLanguageSupported(lang) ? (lang as Language) : "bash"
}

export { Language }
