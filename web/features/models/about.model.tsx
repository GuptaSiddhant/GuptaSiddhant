import type { Model } from "./helpers/model.types"

const model: Model = {
  type: "object",
  properties: {
    id: { type: "string", required: true },
    name: { type: "string", required: true },
    shortName: { type: "string", required: true },
    title: { type: "string", required: true },
    terminalResume: {
      type: "object",
      required: true,
      properties: {
        code: { type: "string", format: "code", required: true },
        copyText: { type: "string" },
      },
    },
    currentCompany: {
      type: "object",
      required: true,
      properties: {
        name: { type: "string", required: true },
        link: { type: "string" },
        hiringLink: { type: "string" },
      },
    },
    techStack: {
      type: "array",
      items: { type: "string" },
    },
    heroAdjectives: {
      type: "array",
      items: { type: "string" },
    },
    link: {
      type: "object",
      properties: {
        linkedin: { type: "string" },
        github: { type: "string" },
        email: { type: "string" },
        website: { type: "string" },
      },
    },
  },
}

export default { model }

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
