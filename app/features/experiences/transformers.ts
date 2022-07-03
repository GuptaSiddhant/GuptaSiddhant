import { generateDurationString } from "./helpers"
import type { CareerProps, EducationProps, ExperienceProps } from "./types"

export function transformEducationToExperience({
  degree,
  field,
  school,
  location,
  ...rest
}: EducationProps): ExperienceProps {
  return {
    ...rest,
    category: "education",
    title: [degree, field].filter(Boolean).join(" - "),
    subtitle: [school, location].filter(Boolean).join(", "),
    duration: generateDurationString(rest),
  }
}

export function transformCareerToExperience({
  position,
  company,
  location,
  ...rest
}: CareerProps): ExperienceProps {
  return {
    ...rest,
    category: "career",
    title: [position].filter(Boolean).join(" - "),
    subtitle: [company, location].filter(Boolean).join(", "),
    duration: generateDurationString(rest),
  }
}
