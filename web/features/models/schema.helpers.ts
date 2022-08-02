import type { Schema } from "./schema-type"

const linksSchema: Schema = {
  type: "array",
  items: {
    type: "object",
    properties: {
      url: {
        type: "string",
      },
      title: {
        type: "string",
      },
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
    required: ["url"],
    additionalProperties: false,
  },
}

const gallerySchema: Schema = {
  type: "array",
  items: {
    type: "object",
    properties: {
      url: {
        type: "string",
      },
      alt: {
        type: "string",
      },
    },
    required: ["url", "alt"],
    additionalProperties: false,
  },
}

export const commonCareerEducationSchema: Schema = {
  type: "object",
  properties: {
    id: {
      type: "string",
    },
    description: {
      type: "string",
      contentMediaType: "markdown",
    },
    startDate: {
      type: "string",
    },
    endDate: {
      type: "string",
    },
    icon: {
      type: "string",
    },
    links: linksSchema,
    gallery: gallerySchema,
    location: {
      type: "string",
    },
    tags: {
      type: "array",
      items: {
        type: "string",
      },
    },
    featured: {
      type: "boolean",
    },
    draft: {
      type: "boolean",
      default: true,
    },
  },
  required: ["id", "startDate"],
}

export const commonBlogProjectSchema: Schema = {
  type: "object",
  properties: {
    id: {
      type: "string",
    },
    title: {
      type: "string",
    },
    subtitle: {
      type: "string",
    },
    description: {
      type: "string",
    },
    content: {
      type: "string",
      contentMediaType: "markdown",
    },
    icon: {
      type: "string",
    },
    tags: {
      type: "array",
      items: {
        type: "string",
      },
    },
    featured: {
      type: "boolean",
    },
    draft: {
      type: "boolean",
      default: true,
    },
    gallery: gallerySchema,
    links: linksSchema,
  },
  required: ["id", "title"],
}
