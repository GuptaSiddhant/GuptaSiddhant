import clsx from "clsx"
import Highlight, { type Language, defaultProps } from "prism-react-renderer"
import { type ComponentPropsWithoutRef, Children } from "react"

import {
  getLanguageBadgeProperties,
  getLanguageFromClassName,
  isLanguageSupported,
} from "~/packages/helpers/code-lang"

import { CopyButton } from "./Button"

export interface CodeBlockProps {
  children: string
  lang?: Language
  className?: string
  copyText?: string
}

export default function CodeBlock({
  children,
  lang,
  className,
  copyText,
}: CodeBlockProps) {
  const language = lang && isLanguageSupported(lang) ? lang : "bash"

  return (
    <output
      className={clsx(className, "-mx-4 bg-default rounded-lg block relative")}
    >
      <Highlight
        {...defaultProps}
        code={children.trim()}
        language={language}
        children={CodePre}
      />
      <CodeBadge language={language} copyText={copyText || children.trim()} />
    </output>
  )
}

interface CodePreProps {
  className: string
  getLineProps: Highlight["getLineProps"]
  getTokenProps: Highlight["getTokenProps"]
  tokens: {
    types: string[]
    content: string
    empty?: boolean
  }[][]
}

function CodePre({
  className,
  tokens,
  getLineProps,
  getTokenProps,
}: CodePreProps): JSX.Element | null {
  return (
    <div className="rounded-md font-normal w-full border border-gray-200 dark:border-0 text-sm">
      <pre className={`overflow-scroll ${className}`} style={{}}>
        <code className={clsx(className, "match-braces")} style={{}}>
          {tokens.map((line, i) => (
            <div key={i} {...getLineProps({ line, key: i })} style={{}}>
              {line.map((token, key) => (
                <span key={key} {...getTokenProps({ token, key })} style={{}} />
              ))}
            </div>
          ))}
        </code>
      </pre>
    </div>
  )
}

interface CodeBadgeProps {
  copyText?: string
  language: Language
}

function CodeBadge({ copyText, language }: CodeBadgeProps): JSX.Element | null {
  const { className = clsx("bg-gray-600"), label = language } =
    getLanguageBadgeProperties(language) || {}

  return (
    <div
      className={clsx(
        className,
        "absolute text-sm z-10 rounded-md -top-2 right-4 px-2",
        "flex items-center gap-2",
      )}
    >
      {copyText ? (
        <CopyButton className="text-sm font-monospace border-r-[1px] border-gray-400 pr-1">
          {copyText}
        </CopyButton>
      ) : null}
      {label}
    </div>
  )
}

export function Pre(props: ComponentPropsWithoutRef<"pre">): JSX.Element {
  const { className, children } = (
    Children.toArray(props.children)[0] as {
      props: { className: string; children: string }
    }
  )?.props

  const lang = getLanguageFromClassName(className)

  return <CodeBlock lang={lang}>{children}</CodeBlock>
}
