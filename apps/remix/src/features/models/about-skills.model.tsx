import type { ModelArrayType, ModelObjectType } from "./helpers/types";
import { ModelSize } from "./helpers/types";

export const skillModel: ModelArrayType = {
  type: "array",
  items: {
    type: "object",
    properties: {
      title: { type: "string", required: true, size: ModelSize.MEDIUM },
      linkUrl: { type: "string", size: ModelSize.MEDIUM },
      iconUrl: { type: "string", size: ModelSize.MEDIUM },
      level: {
        type: "string",
        required: true,
        enum: ["advanced", "intermediate", "basic"],
        size: ModelSize.MEDIUM,
      },
    },
  },
};

export const model: ModelObjectType = {
  type: "object",
  properties: {
    id: { type: "string", required: true },
    soft: skillModel,
    frontend: skillModel,
    backend: skillModel,
    design: skillModel,
    language: skillModel,
    tooling: skillModel,
  },
};

export interface Skills extends Record<SkillCategory, SkillObject[]> {
  id: string;
}

export type SkillCategory =
  | "soft"
  | "frontend"
  | "backend"
  | "design"
  | "language"
  | "tooling";

export interface SkillObject {
  title: string;
  linkUrl?: string;
  iconUrl?: string;
  level?: "advanced" | "intermediate" | "basic";
}
