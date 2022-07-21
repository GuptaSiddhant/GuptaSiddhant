import ResumeIcon from "remixicon-react/FileUserLineIcon"

import { Link } from "@remix-run/react"

import Hero from "@gs/hero"
import { ExternalLink } from "@gs/ui/Link"
import { Paragraph } from "@gs/ui/Text"

import { aboutTexts } from "."

export default function AboutHero(): JSX.Element | null {
  return (
    <Hero>
      <Hero.Header
        title="About me"
        subtitle={["Full-stack developer", "UI designer"].join(" | ")}
      ></Hero.Header>
      <Hero.Description>
        {aboutTexts.map((text, index) => (
          <Paragraph className="text-tertiary" key={index}>
            {text}
          </Paragraph>
        ))}

        <Paragraph className="flex gap-2 border-t border-divider pt-4 text-tertiary">
          <ExternalLink href="/resume.pdf" className="w-max gap-2 flex-center">
            <ResumeIcon />
            Download Resume
          </ExternalLink>
          <span>
            (or try the customisable{" "}
            <Link to="/resume" className="text-link">
              Resume builder
            </Link>
            ).
          </span>
        </Paragraph>
      </Hero.Description>
    </Hero>
  )
}
