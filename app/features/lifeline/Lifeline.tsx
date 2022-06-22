import { Link } from "@remix-run/react"
import clsx from "clsx"
import EducationIcon from "remixicon-react/BookFillIcon"
import CareerIcon from "remixicon-react/Briefcase5FillIcon"
import GithubFillIcon from "remixicon-react/GithubFillIcon"
import LinkedinBoxFillIcon from "remixicon-react/LinkedinBoxFillIcon"

import type { CareerProps, EducationProps } from "../about"
import { CareerRoleType } from "../about"
import { capitalize } from "../helpers/format"
import type { LinkObject } from "../types"
import { ExternalLink } from "../ui/Link"
import { proseWidth } from "../ui/Section"
import { Caption } from "../ui/Text"
import type { LifelineDividerProps, LifeLineItems } from "."
import { LifelineContextProvider } from "./context"
import { createDurationString } from "./helpers"
import LifelineCard from "./LifelineCard"

export interface LifelineProps {
  lifeline: LifeLineItems
}

export default function Lifeline({
  lifeline,
}: LifelineProps): JSX.Element | null {
  return (
    <LifelineContextProvider>
      <section id="lifeline" className={clsx(proseWidth)}>
        <div
          className={clsx(
            "relative border-l border-divider pl-4 py-12 flex flex-col gap-12",
          )}
        >
          {lifeline.map((item) => {
            if ("degree" in item)
              return <EducationCard key={item.id} {...item} />
            if ("position" in item)
              return <CareerCard key={item.id} {...item} />
            return <LifelineDivider key={item.id} {...item} />
          })}
        </div>
      </section>
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
      <Link to={{ hash: linkId }} id={linkId} className="scroll-mt-20">
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
    position,
    company,
    location,
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
      className="group-hocus:border-purple-500 selected:border-purple-500"
    >
      <LifelineCard.Title
        icon={<CareerIcon />}
        className="bg-purple-500"
        id={id}
      >
        {position}
      </LifelineCard.Title>

      <LifelineCard.Subtitle className="text-purple-500" href={homepageLink}>
        {[company, location].join(", ")}
      </LifelineCard.Subtitle>

      <LifelineCard.Byline>
        {createDurationString(career)}
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
  const {
    id,
    degree,
    school,
    field,
    location,
    description,
    gallery,
    icon,
    links,
  } = education

  const homepageLink = links.find((l) => l.type === "homepage")?.url

  return (
    <LifelineCard
      id={id}
      className="group-hocus:border-red-500 selected:border-red-500"
    >
      <LifelineCard.Title
        icon={<EducationIcon />}
        className="bg-red-500"
        id={id}
      >
        {[degree, field].join(" - ")}
      </LifelineCard.Title>

      <LifelineCard.Subtitle className="text-red-500" href={homepageLink}>
        {[school, location].join(", ")}
      </LifelineCard.Subtitle>

      <LifelineCard.Byline>
        {createDurationString(education)}
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
