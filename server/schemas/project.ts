import { createDocumentPreview } from "../helpers/schema-helpers";
import type { Document } from "../helpers/schema-type";
import { actionsField } from "./action";
import { dateFields } from "./date";
import { filesField, galleryField } from "./gallery";
import { tagsField } from "./tag";

export const ProjectDocument: Document = {
  name: "project",
  title: "Project",
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
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: (doc) => doc?.title },
    },
    {
      name: "link",
      title: "Link",
      type: "url",
    },
    {
      name: "logo",
      title: "Logo",
      type: "image",
    },
    {
      name: "association",
      title: "Associated with",
      type: "reference",
      to: [{ type: "career" }, { type: "education" }],
    },
    ...dateFields,
    {
      name: "description",
      title: "Description",
      type: "array",
      of: [{ type: "block", styles: [] }],
    },
    tagsField,
    galleryField,
    filesField,
    actionsField,
  ],
};
