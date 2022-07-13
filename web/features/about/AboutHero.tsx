import Hero from "@gs/hero"
import { ExternalLink } from "@gs/ui/Link"
import { Paragraph } from "@gs/ui/Text"
import ResumeIcon from "remixicon-react/FileUserLineIcon"

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
        <ExternalLink href="/resume.pdf" className="w-max gap-2 flex-center">
          <ResumeIcon />
          Download Resume
        </ExternalLink>
      </Hero.Description>
    </Hero>
  )
}
