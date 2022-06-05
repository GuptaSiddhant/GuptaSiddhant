import CodeBlock from "@gs/components/CodeBlock"
import { InternalLink, ExternalLink } from "@gs/components/Link"
import { ChangingText, H1 } from "@gs/components/Text"
import { formatList } from "@gs/helpers/format"
import Section from "@gs/layouts/Section"
import { useLoaderData } from "@remix-run/react"

import { type HomeLoaderData } from "."

export default function HomeHeroSection(): JSX.Element {
  const {
    about: { title, terminalResume, techStack = [], heroAdjectives = [] },
  } = useLoaderData<HomeLoaderData>()

  return (
    <Section.Hero>
      <H1>
        Hi, I bring designs to life on your screen,
        <ChangingText texts={heroAdjectives.sort()} />.
      </H1>
      <div className="flex flex-col gap-4">
        <p>
          I am a <strong>{title}</strong> with a drive for creating beautiful
          web and mobile apps with {formatList(techStack)}.
        </p>
        <CurrentCompany />
        <InternalLink to="/about" prefetch="intent">
          Read more about me.
        </InternalLink>
      </div>

      <CodeBlock copyText={terminalResume.copyText}>
        {JSON.parse(terminalResume.code)}
      </CodeBlock>
    </Section.Hero>
  )
}

function CurrentCompany() {
  const {
    about: { currentCompany },
  } = useLoaderData<HomeLoaderData>()

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
