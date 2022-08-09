import { transformSchemaInModel } from "./helpers/model.helpers"
import type { Schema } from "./helpers/schema.types"

const skillSchema: Schema = {
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

const schema: Schema = {
  type: "object",
  properties: {
    id: { type: "string", required: true },
    soft: skillSchema,
    frontend: skillSchema,
    backend: skillSchema,
    design: skillSchema,
    language: skillSchema,
  },
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
