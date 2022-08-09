import type { ModelArrayType, ModelObjectType } from "./model.types"
import { ModelSize } from "./model.types"

const linksModel: ModelArrayType = {
  type: "array",
  items: {
    type: "object",
    properties: {
      url: { type: "string", required: true, size: ModelSize.MEDIUM },
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

const galleryModel: ModelArrayType = {
  type: "array",
  items: {
    type: "object",
    properties: {
      url: { type: "string", required: true, size: ModelSize.MEDIUM },
      alt: { type: "string", required: true, size: ModelSize.MEDIUM },
    },
  },
}

const commonModel: ModelObjectType = {
  type: "object",
  properties: {
    id: { type: "string", required: true },
    icon: { type: "string", size: ModelSize.MEDIUM },
    tags: { type: "array", items: { type: "string" } },
    links: linksModel,
    gallery: galleryModel,
    featured: { type: "boolean" },
    draft: { type: "boolean", default: true },
  },
}

export const commonCareerEducationModel: ModelObjectType = {
  type: "object",
  properties: {
    ...commonModel.properties,

    description: { type: "string", format: "markdown" },
    startDate: { type: "string", required: true },
    endDate: { type: "string" },
    location: { type: "string", size: ModelSize.MEDIUM },
  },
}

export const commonBlogProjectModel: ModelObjectType = {
  type: "object",
  properties: {
    ...commonModel.properties,

    title: { type: "string", required: true, size: ModelSize.MEDIUM },
    subtitle: { type: "string", size: ModelSize.MEDIUM },
    description: { type: "string", size: ModelSize.LARGE },
    content: { type: "string", format: "markdown" },
  },
}
