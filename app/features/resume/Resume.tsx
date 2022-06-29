import { Document, Page, Text } from "@react-pdf/renderer"

import type { CareerProps, EducationProps } from "~/features/about"
import {
  generateDurationString,
  generateSubtitleFromCareerItem,
  generateSubtitleFromEducationItem,
  generateTitleFromCareerItem,
  generateTitleFromEducationItem,
} from "~/features/about/helpers"
import type { SkillCategory } from "~/features/about/skills"
import { type Skills } from "~/features/about/skills"
import { capitalize } from "~/features/helpers/format"

import Card from "./components/Card"
import Footer from "./components/Footer"
import Header from "./components/Header"
import Hero from "./components/Hero"
import Section from "./components/Section"
import { createAboutLink, Sections } from "./helpers"
import { texts } from "./theme"
import type { ContactLinkProps } from "./types"

export interface ResumeProps {
  domain: string
  language?: string
  subject?: string

  name: string
  position: string
  terminalResumeCode: string
  contactLinks: ContactLinkProps[]

  aboutTexts?: string[]
  experiences?: CareerProps[]
  educations?: EducationProps[]
  languages?: Array<{ name: string; level: string }>
  skills?: Skills
}

export default function Resume({
  name,
  position,
  subject = "Resume",
  language = "en",
  contactLinks,
  domain = "https://guptasiddhant.com",
  terminalResumeCode,
  experiences = [],
  educations = [],
  aboutTexts = [],
  languages = [],
  skills,
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

        <Section disable={aboutTexts.length === 0}>
          {aboutTexts.map((text, index) => (
            <Text key={index} style={{ marginBottom: 4 }}>
              {text}
            </Text>
          ))}
        </Section>

        <Section
          title={capitalize(Sections.experience)}
          disable={experiences.length === 0}
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
          title={capitalize(Sections.education)}
          disable={educations.length === 0}
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

        <Section
          title={capitalize(Sections.skills)}
          disable={!skills && languages.length === 0}
        >
          {skills
            ? Object.keys(skills).map((category) => (
                <Card key={category} caption={capitalize(category)}>
                  {skills[category as SkillCategory].join(", ")}
                </Card>
              ))
            : null}
          <Card caption="Languages">
            {languages.map((l) => `${l.name} - ${l.level}`).join("\n")}
          </Card>
        </Section>

        <Footer />
      </Page>
    </Document>
  )
}
