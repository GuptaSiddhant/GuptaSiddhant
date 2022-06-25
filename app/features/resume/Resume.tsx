import { Document, Page, Text } from "@react-pdf/renderer"

import type { CareerProps, EducationProps } from "~/features/about"
import { aboutTexts } from "~/features/about"
import {
  generateDurationString,
  generateSubtitleFromCareerItem,
  generateSubtitleFromEducationItem,
  generateTitleFromCareerItem,
  generateTitleFromEducationItem,
} from "~/features/about/helpers"
import { type SkillCategory, languages, skills } from "~/features/about/skills"
import { capitalize } from "~/features/helpers/format"

import Card from "./Card"
import Footer from "./Footer"
import Header from "./Header"
import { createAboutLink } from "./helpers"
import Hero from "./Hero"
import Section from "./Section"
import { texts } from "./theme"
import type { ContactLinkProps } from "./types"

export const defaultDisabledSections = {
  about: false,
  experience: false,
  education: false,
  skills: false,
}

export interface ResumeProps {
  domain: string
  language?: string
  subject?: string

  name: string
  position: string
  contactLinks: ContactLinkProps[]
  experiences: CareerProps[]
  educations: EducationProps[]
  terminalResumeCode: string

  disabledSections?: Partial<typeof defaultDisabledSections>
}

export default function Resume({
  name,
  position,
  subject = "Resume",
  language = "en",
  contactLinks,
  experiences,
  educations,
  domain = "https://guptasiddhant.com",
  disabledSections = {},
  terminalResumeCode,
}: ResumeProps): JSX.Element {
  return (
    <Document
      title={`${name} - ${subject}`}
      author={name}
      subject={subject}
      language={language}
      keywords="resume, cv, portfolio"
      creator={domain.split("//")[1]}
    >
      <Page style={{ ...texts.mono, paddingBottom: 40 }}>
        <Header title={name} subject={subject} />

        <Hero title={name} subtitle={position} contactLinks={contactLinks}>
          {terminalResumeCode}
        </Hero>

        <Section disable={disabledSections.about}>
          {aboutTexts.map((text, index) => (
            <Text key={index} style={{ marginBottom: 4 }}>
              {text}
            </Text>
          ))}
        </Section>

        <Section
          title="Experience"
          disable={disabledSections.experience || experiences.length === 0}
        >
          {experiences.map((item) => (
            <Card
              key={item.id}
              title={generateTitleFromCareerItem(item)}
              subtitle={generateSubtitleFromCareerItem(item)}
              caption={generateDurationString(item, { month: "2-digit" })}
              link={createAboutLink(domain, item.id)}
            >
              {item.description}
            </Card>
          ))}
        </Section>

        <Section
          title="Education"
          disable={disabledSections.education || educations.length === 0}
        >
          {educations.map((item) => (
            <Card
              key={item.id}
              title={generateTitleFromEducationItem(item)}
              subtitle={generateSubtitleFromEducationItem(item)}
              caption={generateDurationString(item, { month: "2-digit" })}
              link={createAboutLink(domain, item.id)}
            >
              {item.description}
            </Card>
          ))}
        </Section>

        <Section title="Skills" disable={disabledSections.skills}>
          {Object.keys(skills).map((category) => (
            <Card key={category} caption={capitalize(category)}>
              {skills[category as SkillCategory].join(", ")}
            </Card>
          ))}
          <Card caption="Languages">
            {languages.map((l) => `${l.name} - ${l.level}`).join("\n")}
          </Card>
        </Section>

        <Footer />
      </Page>
    </Document>
  )
}
