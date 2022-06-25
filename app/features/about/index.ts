import type { Gallery, LinkObject } from "~/features/types"

export interface AboutInfo {
  name: string
  shortName: string
  title: string
  terminalResume: {
    code: string
    copyText?: string
  }
  currentCompany: { name: string; hiringLink?: string; link?: string }
  techStack?: string[]
  heroAdjectives?: string[]
  link?: Record<AboutLinkKey, string>
}

export type AboutLinkKey = "linkedin" | "github" | "email" | "website"

export enum CareerRoleType {
  FullTime = "full-time",
  PartTime = "part-time",
  Freelancer = "freelancer",
  Intern = "intern",
  Contract = "contract",
}

export interface CareerProps extends CommonCareerEducationProps {
  position: string
  company: string
  roleType?: CareerRoleType
}

export interface EducationProps extends CommonCareerEducationProps {
  degree: string
  field: string
  school: string
}

export interface CommonCareerEducationProps {
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

export const gallery = [
  {
    url: "/favicon/android-chrome-384x384.png",
    alt: "Siddhant Gupta's profile",
  },
]
