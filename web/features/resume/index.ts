import { renderToString } from "@react-pdf/renderer"
import { createElement } from "react"

import { aboutTexts } from "@gs/about"
import { getAboutInfo, getSkills } from "@gs/about/service.server"
import { getCareerList, getEducationList } from "@gs/experiences/service.server"
import type { ExperienceProps } from "@gs/experiences/types"

import {
  getFiltersFromSearchParams,
  Sections,
  transformAboutLinkToContactLinks,
} from "./helpers"
import Resume, { type ResumeProps } from "./Resume"

export default async function generateResumeFromUrl(url: URL): Promise<string> {
  const filters = getFiltersFromSearchParams(url.searchParams)

  const [aboutInfo, skills, careerList, educationList] = await Promise.all([
    getAboutInfo(),
    getSkills(),
    getExperienceProps(getCareerList, filters, Sections.experience),
    getExperienceProps(getEducationList, filters, Sections.education),
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
    skills: filters.disabledSections?.skills ? undefined : skills,
    aboutTexts,
  }

  return renderToString(createElement(Resume, resumeProps))
}

async function getExperienceProps(
  callback: () => Promise<ExperienceProps[]>,
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
    const startDate = new Date(item.startDate)
    const endDate = item.endDate ? new Date(item.endDate) : undefined
    // Remove items that end before the filtered from-date
    if (from && endDate && endDate < from) return false
    // Remove items that starts after the filtered till-date
    if (till && startDate > till) return false
    // Remove items that don't have any of the filtered tags
    if (tags.length > 0 && !tags.some((tag) => item.tags?.includes(tag)))
      return false

    return true
  })
}
