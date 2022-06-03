import {
  heroAdjectives,
  techStackList,
  title,
  npx,
  currentCompany,
} from "@gs/about"
import { InternalLink, ExternalLink } from "@gs/components/Link"
import { ChangingText, H1 } from "@gs/components/Text"
import { formatList } from "@gs/helpers/format"
import Section from "@gs/layouts/Section"

import clsx from "clsx"
import { useCallback, useEffect, useState } from "react"

export default function HomeHeroSection(): JSX.Element {
  return (
    <Section.Hero>
      <H1>
        Hi, I bring designs to life on your screen,
        <ChangingText texts={heroAdjectives} />.
      </H1>
      <div className="flex flex-col gap-4">
        <p>
          I am a <strong>{title}</strong> with a drive for creating beautiful
          web and mobile apps with {formatList(techStackList)}.
        </p>
        <CurrentCompany />
        <InternalLink to="/about" prefetch="intent">
          Read more about me.
        </InternalLink>
      </div>

      <TerminalResume code={npx} />
    </Section.Hero>
  )
}

function CurrentCompany() {
  if (!currentCompany?.name) return null
  const { name, hiringLink, link } = currentCompany

  return currentCompany.name ? (
    <p>
      Currently applying my skills at{" "}
      <ExternalLink enableIcon href={link}>
        <strong>{name}</strong>
      </ExternalLink>
      {hiringLink ? (
        <>
          {" ("}
          <ExternalLink href={hiringLink} enableIcon>
            we are hiring
          </ExternalLink>
          {")"}
        </>
      ) : null}
      .
    </p>
  ) : null
}

function TerminalResume({ code }: { code?: string }): JSX.Element | null {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (copied) {
      const timeout = setTimeout(() => setCopied(false), 3000)
      return () => clearTimeout(timeout)
    }
  }, [copied])

  const handleCopy = useCallback(
    (data: string) =>
      window.navigator.clipboard.writeText(data).then(() => setCopied(true)),
    [setCopied],
  )

  return code ? (
    <pre
      className="-mx-4 whitespace-pre-line rounded-lg bg-default p-4 text-base cursor-pointer"
      title="Click to copy"
      onClick={() => handleCopy(code)}
    >
      {/* <code className="mb-1 block select-none text-sm text-disabled">
          [shell]
        </code> */}
      <code className="block select-none text-sm text-disabled">
        # An interactive resume for your terminal, made with React and ink. Run:
      </code>
      <code
        className={clsx(
          "text-primary",
          "before:content-['$'] before:select-none before:text-disabled before:mr-2",
          "grid grid-cols-[max-content_1fr_max-content]",
        )}
      >
        <span>{code}</span>
        <span
          className={clsx(
            "select-none text-sm text-disabled",
            !copied && "border-[1px] border-gray-500 rounded-sm px-1",
          )}
        >
          {copied ? "Copied ✅" : "Copy"}
        </span>
      </code>
    </pre>
  ) : null
}
