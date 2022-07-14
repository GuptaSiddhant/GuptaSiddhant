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

const commonCareerEducationSchema: Schema = {
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

export const educationSchema: Schema = {
  type: "object",
  properties: {
    ...commonCareerEducationSchema.properties,
    degree: {
      type: "string",
    },
    field: {
      type: "string",
    },
    school: {
      type: "string",
    },
  },
  required: [
    ...(commonCareerEducationSchema.required || []),
    "degree",
    "field",
    "school",
  ],
  additionalProperties: false,
}

export const careerSchema: Schema = {
  type: "object",
  properties: {
    ...commonCareerEducationSchema.properties,
    position: {
      type: "string",
    },
    company: {
      type: "string",
    },
    type: {
      type: "string",
      enum: ["full-time", "part-time", "freelancer", "intern", "contract"],
    },
  },
  required: [
    ...(commonCareerEducationSchema.required || []),
    "position",
    "company",
  ],
  additionalProperties: false,
}

const commonBlogProjectSchema: Schema = {
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

export const blogSchema: Schema = {
  type: "object",
  properties: {
    ...commonBlogProjectSchema.properties,
    date: {
      type: "string",
    },
  },
  required: [...(commonBlogProjectSchema.required || []), "date"],
}

export const projectSchema: Schema = {
  type: "object",
  properties: {
    ...commonBlogProjectSchema.properties,
    dateStart: {
      type: "string",
    },
    dateEnd: {
      type: "string",
    },
    association: {
      type: "string",
    },
  },
  required: [...(commonBlogProjectSchema.required || []), "dateStart"],
}
