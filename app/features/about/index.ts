export interface AboutInfo {
  id: string
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

export const gallery = [
  {
    url: "/favicon/android-chrome-384x384.png",
    alt: "Siddhant Gupta's profile",
  },
]

export const aboutTexts = [
  "Ever since I could first remember, I've been fascinated by how things work. While it took me some time to discover my zeal for development, I haven't stopped pursuing it ever since.",
  "I acquainted myself with research, design, business, and management to better understand the implications, communicate well with all parties involved. This also led me to become a better developer in the process.",
  "If I had to describe myself in one word, that'd be STALWART",
]

export interface Skills extends Record<SkillCategory, SkillObject[]> {
  id: string
}

export type SkillCategory =
  | "soft"
  | "frontend"
  | "backend"
  | "design"
  | "language"

export interface SkillObject {
  title: string
  linkUrl?: string
  iconUrl?: string
  level?: "advanced" | "intermediate" | "basic"
}
