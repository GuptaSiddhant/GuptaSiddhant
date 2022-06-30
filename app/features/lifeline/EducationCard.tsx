import EducationIcon from "remixicon-react/BookFillIcon"

import type { EducationProps } from "~/features/about"
import {
  generateDurationString,
  generateSubtitleFromEducationItem,
  generateTitleFromEducationItem,
} from "~/features/about/helpers"

import LifelineCard from "./LifelineCard"
import Linker from "./Linker"

export default function EducationCard(
  education: EducationProps,
): JSX.Element | null {
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
