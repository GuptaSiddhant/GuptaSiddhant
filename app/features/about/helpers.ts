import { formatDate } from "~/features/helpers/format"

import type { CareerProps, CommonCareerEducationProps, EducationProps } from "."

export function generateTitleFromEducationItem({
  degree,
  field,
}: EducationProps) {
  return [degree, field].filter(Boolean).join(" - ")
}
export function generateSubtitleFromEducationItem({
  school,
  location,
}: EducationProps) {
  return [school, location].filter(Boolean).join(", ")
}

export function generateTitleFromCareerItem({ position }: CareerProps) {
  return [position].filter(Boolean).join(" - ")
}
export function generateSubtitleFromCareerItem({
  company,
  location,
}: CareerProps) {
  return [company, location].filter(Boolean).join(", ")
}

export function generateDurationString(
  { startDate, endDate }: CommonCareerEducationProps,
  options: Intl.DateTimeFormatOptions = {},
): string {
  const start = formatDate(startDate, { day: undefined, ...options })
  const end = endDate
    ? formatDate(endDate, { day: undefined, ...options })
    : "Present"

  return [start, end].filter(Boolean).join(" - ")
}
