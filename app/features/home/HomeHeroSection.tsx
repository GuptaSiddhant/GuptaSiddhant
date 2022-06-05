import { heroAdjectives, techStackList, title, currentCompany } from "@gs/about"
import CodeBlock from "@gs/components/CodeBlock"
import { InternalLink, ExternalLink } from "@gs/components/Link"
import { ChangingText, H1 } from "@gs/components/Text"
import { formatList } from "@gs/helpers/format"
import Section from "@gs/layouts/Section"

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

      <CodeBlock lang="bash" copyText="npx guptasiddhant">
        {`# An interactive resume in your terminal, made with React and ink.
$ npx guptasiddhant`}
      </CodeBlock>
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
