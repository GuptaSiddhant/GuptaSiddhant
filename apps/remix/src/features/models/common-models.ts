import type { ModelArrayType, ModelObjectType } from "./types"
import { ModelSize } from "./types"

export const linksModel: ModelArrayType = {
  type: "array",
  items: {
    type: "object",
    properties: {
      url: { type: "string", required: true, size: ModelSize.LARGE },
      title: { type: "string", size: ModelSize.MEDIUM },
      type: {
        type: "string",
        enum: [
          "homepage",
          "other",
          "github",
          "linkedin",
          "twitter",
          "demo",
          "blog",
          "npm",
          "prototype",
          "design",
        ],
      },
    },
  },
}

export const galleryModel: ModelArrayType = {
  type: "array",
  items: {
    type: "object",
    properties: {
      url: { type: "string", required: true, size: ModelSize.LARGE },
      alt: { type: "string", required: true, size: ModelSize.MEDIUM },
    },
  },
}

export const summaryModel: ModelObjectType = {
  type: "object",
  properties: {
    id: { type: "string", required: true },
    icon: { type: "string", size: ModelSize.MEDIUM },
    tags: { type: "array", items: { type: "string" } },
    links: linksModel,
    gallery: galleryModel,
    featured: { type: "boolean" },
    draft: { type: "boolean" },
  },
}

export const commonCareerEducationModel: ModelObjectType = {
  type: "object",
  properties: {
    ...summaryModel.properties,

    description: { type: "string", format: "markdown" },
    startDate: { type: "string", required: true },
    endDate: { type: "string" },
    location: { type: "string", size: ModelSize.MEDIUM },
  },
}

export const commonBlogProjectModel: ModelObjectType = {
  type: "object",
  properties: {
    ...summaryModel.properties,

    title: { type: "string", required: true, size: ModelSize.MEDIUM },
    subtitle: { type: "string", size: ModelSize.MEDIUM },
    description: { type: "string", size: ModelSize.LARGE },
    content: { type: "string", format: "markdown" },
  },
}
