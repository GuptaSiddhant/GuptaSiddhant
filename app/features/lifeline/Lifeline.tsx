import { Link } from "@remix-run/react"
import clsx from "clsx"
import EducationIcon from "remixicon-react/BookFillIcon"
import CareerIcon from "remixicon-react/Briefcase5FillIcon"

import type { CareerProps, EducationProps } from "../about"
import Section from "../ui/Section"
import { Caption } from "../ui/Text"
import type { LifelineDividerProps, LifeLineItems } from "."
import { createDurationString } from "./helpers"
import LifelineCard from "./LifelineCard"

export interface LifelineProps {
  lifeline: LifeLineItems
}

export default function Lifeline({
  lifeline,
}: LifelineProps): JSX.Element | null {
  return (
    <Section.Prose id="lifeline">
      <div className="border-l border-divider pl-4 py-12 flex flex-col gap-12">
        {lifeline.map((item) => {
          if ("degree" in item) return <EducationCard key={item.id} {...item} />
          if ("position" in item) return <CareerCard key={item.id} {...item} />
          return <LifelineDivider key={item.id} {...item} />
        })}
      </div>
    </Section.Prose>
  )
}

function LifelineDivider({
  id,
  type,
  children,
}: LifelineDividerProps): JSX.Element | null {
  if (type === "year") {
    const linkId = "year-" + id
    return (
      <Link to={"#" + linkId} id={linkId} className="scroll-mt-16">
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
  const { id, position, company, location, description, gallery, icon } = career
  const cover = gallery?.[0]?.url
  return (
    <LifelineCard
      id={id}
      className="group-hocus:bg-purple-900"
      coverUrl={cover}
      iconUrl={icon}
    >
      <LifelineCard.Title
        icon={<CareerIcon />}
        className="bg-purple-500"
        alt="Education"
      >
        {position}
      </LifelineCard.Title>
      <LifelineCard.Subtitle className="text-purple-500">
        {[company, location].join(", ")}
      </LifelineCard.Subtitle>
      <LifelineCard.Byline>{createDurationString(career)}</LifelineCard.Byline>
      <LifelineCard.Description>{description}</LifelineCard.Description>
    </LifelineCard>
  )
}

function EducationCard(education: EducationProps): JSX.Element | null {
  const { id, degree, school, field, location, description, gallery, icon } =
    education
  const cover = gallery?.[0]?.url
  return (
    <LifelineCard
      id={id}
      className="group-hocus:bg-red-900"
      coverUrl={cover}
      iconUrl={icon}
    >
      <LifelineCard.Title
        icon={<EducationIcon />}
        className="bg-red-500"
        alt="Career"
      >
        {[degree, field].join(" - ")}
      </LifelineCard.Title>
      <LifelineCard.Subtitle className="text-red-500">
        {[school, location].join(", ")}
      </LifelineCard.Subtitle>
      <LifelineCard.Byline>
        {createDurationString(education)}
      </LifelineCard.Byline>
      <LifelineCard.Description>{description}</LifelineCard.Description>
    </LifelineCard>
  )
}
