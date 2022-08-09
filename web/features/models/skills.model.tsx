import type { Model, ModelArrayType } from "./helpers/model.types"

const skillModel: ModelArrayType<object> = {
  type: "array",
  items: {
    type: "object",
    properties: {
      title: { type: "string", required: true },
      linkUrl: { type: "string" },
      iconUrl: { type: "string" },
      level: {
        type: "string",
        required: true,
        enum: ["advanced", "intermediate", "basic"],
      },
    },
  },
}

const model: Model = {
  type: "object",
  properties: {
    id: { type: "string", required: true },
    soft: skillModel,
    frontend: skillModel,
    backend: skillModel,
    design: skillModel,
    language: skillModel,
  },
}

export default { model }

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
