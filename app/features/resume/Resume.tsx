import { Document, Page, Text } from "@react-pdf/renderer"

import type { CareerProps, EducationProps } from "~/features/about"
import { aboutTexts } from "~/features/about"
import { createDurationString } from "~/features/lifeline/helpers"

import Card from "./Card"
import Footer from "./Footer"
import Header from "./Header"
import { createAboutLink } from "./helpers"
import Hero from "./Hero"
import Section from "./Section"
import Terminal from "./Terminal"
import { texts } from "./theme"
import type { ContactLinkProps } from "./types"

export interface ResumeProps {
  domain: string
  language?: string
  subject?: string
  name: string
  position: string
  contactLinks: ContactLinkProps[]
  experiences: CareerProps[]
  educations: EducationProps[]
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
          <Terminal style={{ marginTop: 8 }}>npx guptasiddhant</Terminal>
        </Hero>
        <Section title="">
          {aboutTexts.map((text, index) => (
            <Text key={index} style={{ marginBottom: 4 }}>
              {text}
            </Text>
          ))}
        </Section>
        <Section title="Experience">
          {experiences.map((item) => (
            <Card
              key={item.id}
              title={item.position}
              subtitle={item.company + ", " + item.location}
              dateline={createDurationString(item, { month: "2-digit" })}
              link={createAboutLink(domain, item.id)}
              description={item.description}
            />
          ))}
        </Section>
        <Section title="Education">
          {educations.map((item) => (
            <Card
              key={item.id}
              title={item.degree + " - " + item.field}
              subtitle={item.school + ", " + item.location}
              dateline={createDurationString(item, { month: "2-digit" })}
              link={createAboutLink(domain, item.id)}
              description={item.description}
            />
          ))}
        </Section>
        <Footer />
      </Page>
    </Document>
  )
}
