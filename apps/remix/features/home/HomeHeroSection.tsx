import { formatList } from "@gs/utils/format"

import { type AboutInfo } from "~/features/about"
import Hero from "~/features/hero"
import CodeBlock from "~/features/ui/CodeBlock"
import { ExternalLink, InternalLink } from "~/features/ui/Link"
import { ChangingText, H1 } from "~/features/ui/Text"

export default function HomeHeroSection(about: AboutInfo): JSX.Element {
  const {
    title,
    terminalResume,
    techStack = [],
    heroAdjectives = [],
    currentCompany,
  } = about

  return (
    <Hero prose>
      <H1>
        Hi, I bring designs to life on your screen,
        <ChangingText texts={heroAdjectives} />
      </H1>
      <div className="flex flex-col gap-4">
        <p>
          I am a <strong>{title}</strong> with a drive for creating beautiful
          web and mobile apps with {formatList(techStack)}.
        </p>
        <CurrentCompany {...currentCompany} />
        <InternalLink to="/about" prefetch="intent">
          Read more about me.
        </InternalLink>
      </div>

      <CodeBlock copyText={terminalResume.copyText}>
        {JSON.parse(terminalResume.code)}
      </CodeBlock>
    </Hero>
  )
}

function CurrentCompany(
  currentCompany: AboutInfo["currentCompany"],
): JSX.Element | null {
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
