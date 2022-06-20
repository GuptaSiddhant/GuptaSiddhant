import ResumeIcon from "remixicon-react/FileUserLineIcon"

import Hero from "../ui/Hero"
import { ExternalLink } from "../ui/Link"
import { Paragraph } from "../ui/Text"

export default function AboutHero(): JSX.Element | null {
  return (
    <Hero>
      <Hero.Header
        title="About me"
        subtitle={["Full-stack developer", "UI designer"].join(" | ")}
      ></Hero.Header>
      <Hero.Description>
        <Paragraph className="text-tertiary">
          Ever since I could first remember, I've been fascinated by how things
          work. While it took me some time to discover my zeal for development,
          I haven't stopped pursuing it ever since.
        </Paragraph>
        <Paragraph className="text-tertiary">
          I acquainted myself with research, design, business, and management to
          better understand the implications, communicate well with all parties
          involved. This also led me to become a better developer in the
          process.
        </Paragraph>
        <Paragraph className="text-tertiary">
          If I had to describe myself in one word, that'd be{" "}
          <strong>stalwart</strong>.
        </Paragraph>

        <ExternalLink href="/resume.pdf" className="flex-center gap-2 w-max">
          <ResumeIcon />
          Resume
        </ExternalLink>
      </Hero.Description>
    </Hero>
  )
}
