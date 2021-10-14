import { createDocumentPreview } from "../helpers/schema-helpers";
import type { Document } from "../helpers/schema-type";
import { actionsField } from "./action";
import { dateFields } from "./date";
import { galleryField } from "./gallery";
import { tagsField } from "./tag";

export const EducationDocument: Document = {
  name: "education",
  title: "Education",
  type: "document",
  preview: createDocumentPreview("field", "school", "logo"),
  orderings: [
    {
      title: "End date",
      name: "endDate",
      by: [{ field: "endDate", direction: "desc" }],
    },
  ],
  fields: [
    {
      name: "degree",
      title: "Degree",
      type: "string",
    },
    {
      name: "field",
      title: "Field of study",
      type: "string",
    },
    {
      name: "school",
      title: "School",
      type: "string",
    },
    {
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: (doc) =>
          (doc?.school || "") +
          " " +
          (doc?.degree || "") +
          " " +
          (doc?.field || ""),
      },
    },
    {
      name: "link",
      title: "Link to school",
      type: "url",
    },
    {
      name: "logo",
      title: "School logo",
      type: "image",
    },
    {
      name: "location",
      title: "Location",
      type: "reference",
      to: [{ type: "location" }],
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
    actionsField,
  ],
};
