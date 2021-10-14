import type { Document, ArrayField } from "../helpers/schema-type";

export const TagDocument: Document = {
  name: "tag",
  title: "Tag",
  type: "document",
  fields: [
    {
      name: "value",
      title: "Value",
      type: "string",
      required: true,
    },
    {
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "value",
      },
    },
  ],
};

export const tagsField: ArrayField = {
  name: "tags",
  title: "Tags",
  type: "array",
  of: [{ type: "reference", to: [{ type: "tag" }] }],
  options: { layout: "tags" },
};
