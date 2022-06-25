import { Document, Page, Text, View } from "@react-pdf/renderer"

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
}

export default function Resume({
  name,
  position,
  subject = "Resume " + new Date().getFullYear(),
  language = "en",
  contactLinks,
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
      <Page style={texts.mono}>
        <Header title={name} subject={subject} />
        <Hero title={name} subtitle={position} contactLinks={contactLinks}>
          <Terminal style={{ marginTop: 8 }}>npx guptasiddhant</Terminal>
        </Hero>
        <Section title="Experience">
          <Text style={{ textAlign: "justify" }} widows={8}>
            {Array(1000).fill("adasd").join(" ")}
          </Text>
        </Section>
      </Page>
    </Document>
  )
}
