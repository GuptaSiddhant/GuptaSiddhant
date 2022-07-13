import type { Gallery, LinkObject } from "@gs/types"

export interface ExperienceProps extends CommonExperienceProps {
  title: string
  subtitle: string
  duration: string
  category: "education" | "career"
}

export enum CareerRoleType {
  FullTime = "full-time",
  PartTime = "part-time",
  Freelancer = "freelancer",
  Intern = "intern",
  Contract = "contract",
}

interface CareerProps extends CommonExperienceProps {
  position: string
  company: string
  type?: CareerRoleType
}

interface EducationProps extends CommonExperienceProps {
  degree: string
  field: string
  school: string
}

interface CommonExperienceProps {
  id: string
  description?: string
  startDate: string
  endDate?: string
  icon?: string
  links: LinkObject[]
  gallery: Gallery
  location?: string
  tags?: string[]
  featured?: boolean
  draft?: boolean
}
