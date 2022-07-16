import type { ExperienceProps } from "@gs/experiences/types"
import type { LinkObject } from "@gs/types"
import { ExternalLink } from "@gs/ui/Link"
import { Link } from "@remix-run/react"
import clsx from "clsx"
import EducationIcon from "remixicon-react/BookFillIcon"
import CareerIcon from "remixicon-react/Briefcase5FillIcon"
import GithubFillIcon from "remixicon-react/GithubFillIcon"
import LinkedinBoxFillIcon from "remixicon-react/LinkedinBoxFillIcon"

import { EditIcon } from "../icons"
import LifelineCard from "./LifelineCard"

export default function ExperienceCard(
  item: ExperienceProps & { enableEditButton?: boolean },
): JSX.Element {
  const {
    id,
    title,
    subtitle,
    duration,
    links = [],
    description,
    gallery,
    icon,
    category,
    enableEditButton,
  } = item

  const homepageLink = links.find((l) => l.type === "homepage")?.url
  const isCareerItem = category === "career"

  const cardClassName = clsx(
    isCareerItem
      ? "text-purple-500 group-hocus:border-purple-500 selected:border-purple-500"
      : "text-red-500 group-hocus:border-red-500 selected:border-red-500",
  )

  const iconElement = isCareerItem ? <CareerIcon /> : <EducationIcon />
  const cardIconClassName = clsx(isCareerItem ? "bg-purple-500" : "bg-red-500")

  return (
    <LifelineCard id={id} className={cardClassName}>
      <LifelineCard.Title
        icon={iconElement}
        className={cardIconClassName}
        id={id}
      >
        {title}
      </LifelineCard.Title>

      <LifelineCard.Subtitle href={homepageLink}>
        {subtitle}
      </LifelineCard.Subtitle>

      <LifelineCard.Byline>
        {duration}
        <Linker links={links} />
      </LifelineCard.Byline>

      <LifelineCard.Description>{description}</LifelineCard.Description>

      <LifelineCard.Gallery gallery={gallery} iconUrl={icon} alt={id} />

      {enableEditButton && (
        <Link
          to={`/admin/editor/${category}/${id}`}
          className="absolute top-0 right-0 p-2"
          title="Edit"
        >
          <EditIcon />
        </Link>
      )}
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
