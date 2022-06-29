import { Link } from "@remix-run/react"
import clsx from "clsx"
import EducationIcon from "remixicon-react/BookFillIcon"
import CareerIcon from "remixicon-react/Briefcase5FillIcon"
import GithubFillIcon from "remixicon-react/GithubFillIcon"
import LinkedinBoxFillIcon from "remixicon-react/LinkedinBoxFillIcon"

import type { CareerProps, EducationProps } from "~/features/about"
import { CareerRoleType } from "~/features/about"
import { capitalize } from "~/features/helpers/format"
import type { TocItem } from "~/features/helpers/table-of-contents"
import type { LinkObject } from "~/features/types"
import { ExternalLink } from "~/features/ui/Link"
import Section, { proseWidth } from "~/features/ui/Section"
import { Caption } from "~/features/ui/Text"

import {
  generateDurationString,
  generateSubtitleFromCareerItem,
  generateSubtitleFromEducationItem,
  generateTitleFromCareerItem,
  generateTitleFromEducationItem,
} from "~/features/aboutt/helpers"
import type { LifelineDividerProps, LifeLineItems } from "."
import { LifelineContextProvider } from "./context"
import LifelineCard from "./LifelineCard"

export interface LifelineProps {
  lifeline: LifeLineItems
  toc?: TocItem[]
}

export default function Lifeline({
  lifeline,
  toc,
}: LifelineProps): JSX.Element | null {
  return (
    <LifelineContextProvider>
      <Section.Reader
        id="lifeline"
        className={clsx(
          proseWidth,
          "border-l border-divider pl-4 flex flex-col gap-12 py-12",
        )}
        toc={toc}
      >
        {lifeline.map((item) => {
          if ("degree" in item) return <EducationCard key={item.id} {...item} />
          if ("position" in item) return <CareerCard key={item.id} {...item} />
          return <LifelineDivider key={item.id} {...item} />
        })}
      </Section.Reader>
    </LifelineContextProvider>
  )
}

function LifelineDivider({
  id,
  type,
  children,
}: LifelineDividerProps): JSX.Element | null {
  if (type === "year") {
    const linkId = id

    return (
      <Link
        to={{ hash: linkId }}
        id={linkId}
        className="scroll-mt-20 no-underline"
      >
        <Caption className="relative">
          {children}
          <div
            role="presentation"
            className={clsx(
              "absolute -left-6 top-2 w-4 h-4 rounded-full bg-white",
            )}
          />
        </Caption>
      </Link>
    )
  }

  return null
}

function CareerCard(career: CareerProps): JSX.Element | null {
  const {
    id,
    description,
    gallery,
    icon,
    roleType = CareerRoleType.FullTime,
    links,
  } = career

  const homepageLink = links.find((l) => l.type === "homepage")?.url

  return (
    <LifelineCard
      id={id}
      className="text-purple-500 group-hocus:border-purple-500 selected:border-purple-500"
    >
      <LifelineCard.Title
        icon={<CareerIcon />}
        className="bg-purple-500"
        id={id}
      >
        {generateTitleFromCareerItem(career)}
      </LifelineCard.Title>

      <LifelineCard.Subtitle href={homepageLink}>
        {generateSubtitleFromCareerItem(career)}
      </LifelineCard.Subtitle>

      <LifelineCard.Byline>
        {generateDurationString(career)}
        <span>|</span>
        <span className="whitespace-nowrap">{capitalize(roleType)}</span>
        <Linker links={links} />
      </LifelineCard.Byline>

      <LifelineCard.Description>{description}</LifelineCard.Description>

      <LifelineCard.Gallery gallery={gallery} iconUrl={icon} alt={id} />
    </LifelineCard>
  )
}

function EducationCard(education: EducationProps): JSX.Element | null {
  const { id, description, gallery, icon, links } = education

  const homepageLink = links.find((l) => l.type === "homepage")?.url

  return (
    <LifelineCard
      id={id}
      className="text-red-500 group-hocus:border-red-500 selected:border-red-500"
    >
      <LifelineCard.Title
        icon={<EducationIcon />}
        className="bg-red-500"
        id={id}
      >
        {generateTitleFromEducationItem(education)}
      </LifelineCard.Title>

      <LifelineCard.Subtitle href={homepageLink}>
        {generateSubtitleFromEducationItem(education)}
      </LifelineCard.Subtitle>

      <LifelineCard.Byline>
        {generateDurationString(education)}
        <Linker links={links} />
      </LifelineCard.Byline>

      <LifelineCard.Description>{description}</LifelineCard.Description>

      <LifelineCard.Gallery gallery={gallery} iconUrl={icon} alt={id} />
    </LifelineCard>
  )
}

function Linker({ links = [] }: { links?: LinkObject[] }) {
  const linksWithoutHomepage = links.filter((l) => l.type !== "homepage")

  if (linksWithoutHomepage.length === 0) return null

  return (
    <>
      <span>|</span>
      {linksWithoutHomepage.map(({ type, url, title }) => {
        const content = (() => {
          switch (type) {
            case "linkedin":
              return <LinkedinBoxFillIcon />
            case "github":
              return <GithubFillIcon />
            default:
              return title || type
          }
        })()

        return (
          <ExternalLink key={type || url} href={url} disableUnderline>
            {content}
          </ExternalLink>
        )
      })}
    </>
  )
}
