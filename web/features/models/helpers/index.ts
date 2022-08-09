import type { Model, ModelArrayType } from "./model.types"

const linksModel: ModelArrayType<object> = {
  type: "array",
  items: {
    type: "object",
    properties: {
      url: { type: "string", required: true, size: "medium" },
      title: { type: "string", size: "medium" },
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

const galleryModel: ModelArrayType<object> = {
  type: "array",
  items: {
    type: "object",
    properties: {
      url: { type: "string", required: true, size: "medium" },
      alt: { type: "string", required: true, size: "medium" },
    },
  },
}

const commonModel: Model = {
  type: "object",
  properties: {
    id: { type: "string", required: true },
    icon: { type: "string", size: "medium" },
    tags: { type: "array", items: { type: "string" } },
    links: linksModel,
    gallery: galleryModel,
    featured: { type: "boolean" },
    draft: { type: "boolean", default: true },
  },
}

export const commonCareerEducationModel: Model = {
  type: "object",
  properties: {
    ...commonModel.properties,

    description: { type: "string", format: "markdown" },
    startDate: { type: "string", required: true },
    endDate: { type: "string" },
    location: { type: "string", size: "medium" },
  },
}

export const commonBlogProjectModel: Model = {
  type: "object",
  properties: {
    ...commonModel.properties,

    title: { type: "string", required: true, size: "medium" },
    subtitle: { type: "string", size: "medium" },
    description: { type: "string", size: "large" },
    content: { type: "string", format: "markdown" },
  },
}
