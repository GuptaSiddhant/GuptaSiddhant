import clsx from "clsx"
import Highlight, { defaultProps, type Language } from "prism-react-renderer"
import { CopyButton } from "./Button"

export default function CodeBlock({
  children,
  lang,
  className,
  copyText,
}: {
  children: string
  lang?: Language
  className?: string
  copyText?: string
}) {
  const language = lang && isLanguageSupported(lang) ? lang : "bash"

  return (
    <div className={clsx(className, "-mx-4 bg-default rounded-lg")}>
      <Highlight {...defaultProps} code={children.trim()} language={language}>
        {({ className, tokens, getLineProps, getTokenProps }) => (
          <div className="relative not-prose">
            <div
              className={clsx(
                "absolute bg-white text-sm z-10 border border-gray-300 px-2 rounded-md -top-3 right-2",
                "dark:bg-gray-600 dark:border-0",
                "flex items-center gap-2",
              )}
            >
              <CopyButton className="text-sm font-monospace border-r-[1px] border-gray-400 pr-1">
                {copyText || children.trim()}
              </CopyButton>
              {lang || "text"}
            </div>
            <div
              className="rounded-md font-normal w-full border border-gray-200
                dark:border-0 text-sm"
            >
              <pre className={`overflow-scroll ${className}`} style={{}}>
                <code className={className} style={{}}>
                  {tokens.map((line, i) => (
                    <div key={i} {...getLineProps({ line, key: i })} style={{}}>
                      {line.map((token, key) => (
                        <span
                          key={key}
                          {...getTokenProps({ token, key })}
                          style={{}}
                        />
                      ))}
                    </div>
                  ))}
                </code>
              </pre>
            </div>
          </div>
        )}
      </Highlight>
    </div>
  )
}

// function getLanguageFromClassName(className: string) {
//   const match = className.match(/language-(\w+)/)
//   return match ? match[1] : ""
// }

function isLanguageSupported(lang: string): lang is Language {
  return [
    "markup",
    "bash",
    "clike",
    "c",
    "cpp",
    "css",
    "javascript",
    "jsx",
    "coffeescript",
    "actionscript",
    "css-extr",
    "diff",
    "git",
    "go",
    "graphql",
    "handlebars",
    "json",
    "less",
    "makefile",
    "markdown",
    "objectivec",
    "ocaml",
    "python",
    "reason",
    "sass",
    "scss",
    "sql",
    "stylus",
    "tsx",
    "typescript",
    "wasm",
    "yaml",
  ].includes(lang)
}
