import CareerIcon from "remixicon-react/Briefcase5FillIcon"

import type { CareerProps } from "~/features/about"
import { CareerRoleType } from "~/features/about"
import {
  generateDurationString,
  generateSubtitleFromCareerItem,
  generateTitleFromCareerItem,
} from "~/features/about/helpers"
import { capitalize } from "~/features/helpers/format"

import LifelineCard from "./LifelineCard"
import Linker from "./Linker"

export default function CareerCard(career: CareerProps): JSX.Element | null {
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
