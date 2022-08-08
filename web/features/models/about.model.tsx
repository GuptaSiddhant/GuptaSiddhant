import { transformSchemaInModel } from "./helpers/model.helpers"
import type { Schema } from "./helpers/schema.types"

const schema: Schema = {
  type: "object",
  properties: {
    id: { type: "string" },
    name: { type: "string" },
    shortName: { type: "string" },
    title: { type: "string" },
    terminalResume: {
      type: "object",
      properties: {
        code: { type: "string" },
        copyText: { type: "string" },
      },
      required: ["code"],
    },
    currentCompany: {
      type: "object",
      properties: {
        name: { type: "string" },
        link: { type: "string" },
        hiringLink: { type: "string" },
      },
      required: ["name"],
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
  required: [
    "id",
    "name",
    "shortName",
    "title",
    "terminalResume",
    "currentCompany",
  ],
}

const model = transformSchemaInModel(schema)

export default { schema, model }

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
