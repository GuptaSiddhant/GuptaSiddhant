import { renderToString } from "@react-pdf/renderer"

import { aboutTexts } from "@gs/about"
import { getAboutInfo, getAboutSkills } from "@gs/about/service.server"
import { getCareerSummaryItems } from "@gs/models/career.server"
import { getEducationSummaryItems } from "@gs/models/education.server"
import type { SummaryItem } from "@gs/summary"

import {
  getFiltersFromSearchParams,
  Sections,
  transformAboutLinkToContactLinks,
} from "./helpers"
import Resume, { type ResumeProps } from "./Resume"
import { ResumeContextProvider } from "./ResumeContext"
import { type FontType } from "./theme"

export default async function generateResumeFromUrl(url: URL): Promise<string> {
  const font = (url.searchParams.get("font") || "mono") as FontType
  const color = url.searchParams.get("color") ?? undefined
  const filters = getFiltersFromSearchParams(url.searchParams)

  const [aboutInfo, skills, careerList, educationList] = await Promise.all([
    getAboutInfo(),
    getAboutSkills(),
    getSummaryItems(getCareerSummaryItems, filters, Sections.experience),
    getSummaryItems(getEducationSummaryItems, filters, Sections.education),
  ])
  const { link, name, title, terminalResume } = aboutInfo

  const resumeProps: ResumeProps = {
    name,
    position: title,
    contactLinks: transformAboutLinkToContactLinks(link),
    experiences: careerList,
    educations: educationList,
    domain: url.origin,
    terminalResumeCode: terminalResume.copyText!,
    skills: filters.disabledSections?.skills
      ? undefined
      : { ...skills, id: "" },
    aboutTexts,
  }

  return renderToString(
    <ResumeContextProvider font={font} color={color}>
      <Resume {...resumeProps} />
    </ResumeContextProvider>,
  )
}

async function getSummaryItems(
  callback: () => Promise<SummaryItem[]>,
  filters?: ReturnType<typeof getFiltersFromSearchParams>,
  sectionKey?: Sections,
) {
  const disabled = Boolean(
    sectionKey ? filters?.disabledSections?.[sectionKey] : false,
  )
  if (disabled) return []

  const list = await callback()
  if (!filters) return list

  const { tags, from, till } = filters
  return list.filter((item) => {
    const date = item.date ? new Date(item.date) : new Date()

    if (till && date > till) return false
    if (from && date < from) return false

    // Remove items that don't have any of the filtered tags
    if (tags.length > 0 && !tags.some((tag) => item.tags?.includes(tag)))
      return false

    return true
  })
}
