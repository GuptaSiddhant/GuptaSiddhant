import { renderToString } from "@react-pdf/renderer"
import { createElement } from "react"

import { type CommonCareerEducationProps, aboutTexts } from "~/features/about"
import {
  getAboutInfo,
  getCareerList,
  getEducationList,
} from "~/features/about/service.server"
import { languages, skills } from "~/features/about/skills"

import {
  getFiltersFromSearchParams,
  Sections,
  transformAboutLinkToContactLinks,
} from "./helpers"
import Resume, { type ResumeProps } from "./Resume"

export default async function handler(request: Request): Promise<string> {
  const { origin, searchParams } = new URL(request.url)

  const filters = getFiltersFromSearchParams(searchParams)

  const [aboutInfo, careerList, educationList] = await Promise.all([
    getAboutInfo(),
    getCareerEducationProps(getCareerList, filters, Sections.experience),
    getCareerEducationProps(getEducationList, filters, Sections.education),
  ])
  const { link, name, title, terminalResume } = aboutInfo

  const resumeProps: ResumeProps = {
    name,
    position: title,
    contactLinks: transformAboutLinkToContactLinks(link),
    experiences: careerList,
    educations: educationList,
    domain: origin,
    terminalResumeCode: terminalResume.copyText!,
    languages: filters.disabledSections?.skills ? [] : languages,
    skills: filters.disabledSections?.skills ? undefined : skills,
    aboutTexts,
  }

  return renderToString(createElement(Resume, resumeProps))
}

async function getCareerEducationProps<T extends CommonCareerEducationProps>(
  callback: () => Promise<T[]>,
  filters?: ReturnType<typeof getFiltersFromSearchParams>,
  sectionKey?: Sections,
) {
  const disabled = sectionKey ? filters?.disabledSections?.[sectionKey] : false
  if (disabled) return []

  const list = await callback()
  if (!filters) return list

  return list.filter((item) => {
    const startDate = new Date(item.startDate)
    const endDate = item.endDate ? new Date(item.endDate) : undefined
    // Remove items that end before the filtered from-date
    if (filters.from && endDate && endDate < filters.from) return false
    // Remove items that starts after the filtered till-date
    if (filters.till && startDate > filters.till) return false

    return true
  })
}