import type { ModelObjectType } from "./helpers/types";
import { ModelSize } from "./helpers/types";

export const model: ModelObjectType = {
  type: "object",
  properties: {
    id: { type: "string", required: true },
    name: { type: "string", required: true, size: ModelSize.MEDIUM },
    shortName: { type: "string", required: true },
    title: { type: "string", required: true, size: ModelSize.MEDIUM },
    currentCompany: { type: "string" },
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
    hero: {
      type: "object",
      required: true,
      properties: {
        title: { type: "string", size: ModelSize.FULL, required: true },
        adjectives: {
          type: "array",
          items: { type: "string" },
          required: true,
        },
      },
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
};

export interface AboutInfo {
  id: string;
  name: string;
  shortName: string;
  title: string;
  terminalResume: {
    code: string;
    copyText?: string;
  };
  hero: {
    title: string;
    adjectives: string[];
  };
  currentCompany?: string;
  techStack?: string[];
  heroAdjectives?: string[];
  link?: Record<AboutLinkKey, string>;
}

export type AboutLinkKey = "linkedin" | "github" | "email" | "website";
