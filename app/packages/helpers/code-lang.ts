import clsx from "clsx"
import { type Language } from "prism-react-renderer"

interface SupportedLanguageProperties {
  lang: Language
  label?: string
  className?: string
}

const supportedLanguages: SupportedLanguageProperties[] = [
  { lang: "markup" },
  { lang: "bash" },
  { lang: "clike" },
  { lang: "c" },
  { lang: "cpp" },
  { lang: "css" },
  { lang: "javascript", className: clsx("bg-yellow-700"), label: "JS" },
  { lang: "jsx", className: clsx("bg-yellow-700") },
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
  { lang: "tsx", className: clsx("bg-blue-700") },
  { lang: "typescript", className: clsx("bg-blue-700"), label: "TS" },
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
  const match = className.match(/language-(\w+)/)
  const lang = match ? match[1] : ""

  return isLanguageSupported(lang) ? (lang as Language) : "bash"
}
