import { renderToString } from "@react-pdf/renderer"
import { createElement } from "react"

import {
  getAboutInfo,
  getCareerList,
  getEducationList,
} from "~/features/about/service.server"

import type { CommonCareerEducationProps } from "../about"
import {
  getDisabledSectionsFromSearchParams,
  getFiltersFromSearchParams,
  transformAboutLinkToContactLinks,
} from "./helpers"
import Resume, { type ResumeProps } from "./Resume"

export default async function handler(request: Request): Promise<string> {
  const { origin, searchParams } = new URL(request.url)

  const disabledSections = getDisabledSectionsFromSearchParams(searchParams)
  const filters = getFiltersFromSearchParams(searchParams)

  const [aboutInfo, careerList, educationList] = await Promise.all([
    getAboutInfo(),
    getCareerEducationProps(
      getCareerList,
      disabledSections?.experience,
      filters,
    ),
    getCareerEducationProps(
      getEducationList,
      disabledSections?.education,
      filters,
    ),
  ])
  const { link, name, title, terminalResume } = aboutInfo

  const resumeProps: ResumeProps = {
    name,
    position: title,
    contactLinks: transformAboutLinkToContactLinks(link),
    experiences: careerList,
    educations: educationList,
    domain: origin,
    disabledSections,
    terminalResumeCode: terminalResume.copyText!,
  }

  return renderToString(createElement(Resume, resumeProps))
}

async function getCareerEducationProps<T extends CommonCareerEducationProps>(
  callback: () => Promise<T[]>,
  disabled = false,
  filters?: ReturnType<typeof getFiltersFromSearchParams>,
) {
  if (disabled) return []
  const list = await callback()

  if (!filters) return list
  return list.filter((item) => {
    const startDate = new Date(item.startDate)
    const endDate = item.endDate ? new Date(item.endDate) : undefined
    // Remove items that end before the filtered start date
    if (filters.startDate && endDate && endDate < filters.startDate)
      return false
    // Remove items that starts after the filtered end date
    if (filters.endDate && startDate > filters.endDate) return false

    return true
  })
}
