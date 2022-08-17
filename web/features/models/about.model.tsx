import type { Model } from "./helpers/model.types"
import { ModelSize } from "./helpers/model.types"

const model: Model = {
  type: "object",
  properties: {
    id: { type: "string", required: true },
    name: { type: "string", required: true, size: ModelSize.MEDIUM },
    shortName: { type: "string", required: true },
    title: { type: "string", required: true, size: ModelSize.MEDIUM },

    currentCompany: {
      type: "object",
      required: true,
      properties: {
        name: { type: "string", required: true, size: ModelSize.MEDIUM },
        link: { type: "string", size: ModelSize.MEDIUM },
        hiringLink: { type: "string", size: ModelSize.MEDIUM },
      },
    },
    terminalResume: {
      type: "object",
      required: true,
      properties: {
        copyText: { type: "string", size: ModelSize.FULL },
        code: {
          type: "string",
          format: "code",
          required: true,
          size: ModelSize.SMALL,
        },
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
        linkedin: { type: "string", size: ModelSize.LARGE },
        github: { type: "string", size: ModelSize.LARGE },
        email: { type: "string", size: ModelSize.LARGE },
        website: { type: "string", size: ModelSize.LARGE },
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
