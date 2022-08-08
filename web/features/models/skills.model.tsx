import { transformSchemaInModel } from "./helpers/model.helpers"
import type { Schema } from "./helpers/schema.types"

const skill: Schema = {
  type: "object",
  properties: {
    title: { type: "string" },
    linkUrl: { type: "string" },
    iconUrl: { type: "string" },
    level: { type: "string", enum: ["advanced", "intermediate", "basic"] },
  },
  required: ["title"],
}

const schema: Schema = {
  type: "object",
  properties: {
    id: { type: "string" },
    soft: { type: "array", items: skill },
    frontend: { type: "array", items: skill },
    backend: { type: "array", items: skill },
    design: { type: "array", items: skill },
    language: { type: "array", items: skill },
  },
  required: ["id", "soft", "frontend", "backend", "design", "language"],
}

const model = transformSchemaInModel(schema)

export default { schema, model }

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
