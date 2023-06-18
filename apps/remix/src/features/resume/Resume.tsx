import { Document, Page, Text } from "@react-pdf/renderer";
import MdxToJsx from "markdown-to-jsx";

import type { SkillCategory, Skills } from "@gs/models/about-skills.model";
import type { SummaryItem } from "@gs/summary";
import { capitalize } from "@gs/utils/format";

import useResumeContext from "./ResumeContext";
import type { ResumeCardProps } from "./components/ResumeCard";
import ResumeCard from "./components/ResumeCard";
import ResumeFooter from "./components/ResumeFooter";
import ResumeHeader from "./components/ResumeHeader";
import ResumeHero from "./components/ResumeHero";
import ResumeSection from "./components/ResumeSection";
import { ResumeSections } from "./constants";
import { createAboutLink } from "./helpers";
import type { ContactLinkProps } from "./types";

export interface ResumeProps {
  domain: string;
  language?: string;
  subject?: string;

  name: string;
  position: string;
  terminalResumeCode: string;
  contactLinks: ContactLinkProps[];

  bio?: string;
  experiences?: SummaryItem[];
  educations?: SummaryItem[];
  skills?: Skills;
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
  bio,
  skills,
}: ResumeProps): JSX.Element {
  const { texts, colors } = useResumeContext();

  return (
    <Document
      title={`${name} - ${subject}`}
      author={name}
      subject={subject}
      language={language}
      keywords="resume, cv, portfolio"
      creator={domain.split("//")[1]}
    >
      <Page
        style={{ ...texts.p, color: colors.textPrimary, paddingBottom: 40 }}
      >
        <ResumeHeader title={name} subject={subject} />

        <ResumeHero
          title={name}
          subtitle={position}
          contactLinks={contactLinks}
        >
          {terminalResumeCode}
        </ResumeHero>

        <ResumeSection disable={!bio}>
          <MdxPdf mdx={bio} />
        </ResumeSection>

        <ResumeSection
          title={capitalize(ResumeSections.experience)}
          disable={experiences.length === 0}
        >
          {experiences.map((item) => (
            <ResumeCard key={item.id} {...genCardProps(item, domain)} />
          ))}
        </ResumeSection>

        <ResumeSection
          title={capitalize(ResumeSections.education)}
          disable={educations.length === 0}
        >
          {educations.map((item) => (
            <ResumeCard key={item.id} {...genCardProps(item, domain)} />
          ))}
        </ResumeSection>

        <ResumeSection
          title={capitalize(ResumeSections.skills)}
          disable={!skills}
        >
          {skills
            ? Object.keys(skills).map((category) =>
                category === "id" ? null : category === "language" ? (
                  <ResumeCard key="language" caption="Languages">
                    {skills["language"]
                      .map((l) => `${l.title} - ${l.level}`)
                      .join("\n")}
                  </ResumeCard>
                ) : (
                  <ResumeCard key={category} caption={capitalize(category)}>
                    {skills[category as SkillCategory]
                      ?.map((skill) => skill.title)
                      .join(", ")}
                  </ResumeCard>
                ),
              )
            : null}
        </ResumeSection>

        <ResumeFooter />
      </Page>
    </Document>
  );
}

function genCardProps(item: SummaryItem, domain: string): ResumeCardProps {
  const { id, title, subtitle, description } = item;
  return {
    link: createAboutLink(domain, id),
    title,
    subtitle,
    caption: item.duration,
    children: description,
  };
}

function MdxPdf({ mdx }: { mdx?: string }): JSX.Element | null {
  const { texts } = useResumeContext();

  if (!mdx) return null;

  return (
    <MdxToJsx
      options={{
        overrides: {
          strong: ({ children }) => (
            <Text style={texts.strong}>{children}</Text>
          ),
          p: ({ children }) => (
            <Text style={{ marginBottom: 4 }}>{children}</Text>
          ),
          small: ({ children }) => <Text style={texts.small}>{children}</Text>,
          h1: ({ children }) => <Text style={texts.h1}>{children}</Text>,
          h2: ({ children }) => <Text style={texts.h2}>{children}</Text>,
          h3: ({ children }) => <Text style={texts.h3}>{children}</Text>,
          h4: ({ children }) => <Text style={texts.h4}>{children}</Text>,
          h5: ({ children }) => <Text style={texts.h5}>{children}</Text>,
          h6: ({ children }) => <Text style={texts.h6}>{children}</Text>,
          code: ({ children }) => <Text style={texts.mono}>{children}</Text>,
          pre: ({ children }) => <Text style={texts.mono}>{children}</Text>,
        },
      }}
    >
      {mdx}
    </MdxToJsx>
  );
}
