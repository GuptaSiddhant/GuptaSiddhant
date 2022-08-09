import type { Schema } from "./schema.types"

const linksSchema: Schema = {
  type: "array",
  items: {
    type: "object",
    properties: {
      url: { type: "string", required: true },
      title: { type: "string" },
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

const gallerySchema: Schema = {
  type: "array",
  items: {
    type: "object",
    properties: {
      url: { type: "string", required: true },
      alt: { type: "string", required: true },
    },
  },
}

export const commonCareerEducationSchema: Schema = {
  type: "object",
  properties: {
    id: { type: "string", required: true },
    description: { type: "string", contentMediaType: "markdown" },
    startDate: { type: "string", required: true },
    endDate: { type: "string" },
    icon: { type: "string" },
    links: linksSchema,
    gallery: gallerySchema,
    location: { type: "string" },
    tags: { type: "array", items: { type: "string" } },
    featured: { type: "boolean" },
    draft: { type: "boolean", default: true },
  },
}

export const commonBlogProjectSchema: Schema = {
  type: "object",
  properties: {
    id: { type: "string", required: true },
    title: { type: "string", required: true },
    subtitle: { type: "string" },
    description: { type: "string" },
    content: { type: "string", contentMediaType: "markdown" },
    icon: { type: "string" },
    tags: { type: "array", items: { type: "string" } },
    featured: { type: "boolean" },
    draft: { type: "boolean", default: true },
    gallery: gallerySchema,
    links: linksSchema,
  },
}
