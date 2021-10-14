import { createDocumentPreview } from "../../helpers/schema-helpers";
import type { Document } from "../../helpers/schema-type";
import { ImageWithCaption } from "../gallery";
import { tagsField } from "../tag";
import { blogContentField } from "./annotations";

export const BlogDocument: Document = {
  name: "blog",
  title: "Blog",
  type: "document",
  preview: createDocumentPreview("title", "association.title", "logo"),
  orderings: [
    {
      title: "End date",
      name: "endDate",
      by: [{ field: "endDate", direction: "desc" }],
    },
  ],
  fields: [
    {
      name: "title",
      title: "Title",
      type: "string",
    },
    {
      name: "date",
      title: "Date",
      type: "date",
    },
    {
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title" },
    },
    {
      ...ImageWithCaption,
      name: "hero",
      title: "Hero image",
    },
    tagsField,
    blogContentField,
  ],
};
