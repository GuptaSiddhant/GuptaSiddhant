import { Document, Page, Text } from "@react-pdf/renderer"

import type { CareerProps, EducationProps } from "../about"
import Card from "./Card"
import Footer from "./Footer"
import Header from "./Header"
import Hero from "./Hero"
import Section from "./Section"
import Terminal from "./Terminal"
import { texts } from "./theme"
import type { ContactLinkProps } from "./types"

export interface ResumeProps {
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
}: ResumeProps): JSX.Element {
  return (
    <Document
      title={`${name} - ${subject}`}
      author={name}
      subject={subject}
      language={language}
      keywords="resume, cv, portfolio"
      creator="guptasiddhant.com"
    >
      <Page style={{ ...texts.mono, paddingBottom: 40 }}>
        <Header title={name} subject={subject} />
        <Hero title={name} subtitle={position} contactLinks={contactLinks}>
          <Terminal style={{ marginTop: 8 }}>npx guptasiddhant</Terminal>
        </Hero>
        <Section title="Experience">
          {experiences.map((item) => (
            <Card
              key={item.id}
              title={item.position}
              children={item.company + ", " + item.location}
            />
          ))}
        </Section>
        <Section title="Education">
          {educations.map((item) => (
            <Card
              key={item.id}
              title={item.degree + " - " + item.field}
              children={item.school + ", " + item.location}
            />
          ))}
        </Section>
        <Footer />
      </Page>
    </Document>
  )
}
