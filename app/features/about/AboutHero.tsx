import ResumeIcon from "remixicon-react/FileUserLineIcon"

import Hero from "../ui/Hero"
import { ExternalLink } from "../ui/Link"
import { Paragraph } from "../ui/Text"
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
        <ExternalLink href="/resume.pdf" className="flex-center gap-2 w-max">
          <ResumeIcon />
          Resume
        </ExternalLink>
      </Hero.Description>
    </Hero>
  )
}
