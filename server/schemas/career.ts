import { createDocumentPreview } from "../helpers/schema-helpers";
import type { Document } from "../helpers/schema-type";
import { actionsField } from "./action";
import { dateFields } from "./date";
import { galleryField } from "./gallery";
import { tagsField } from "./tag";

export const CareerDocument: Document = {
  name: "career",
  title: "Career",
  type: "document",
  preview: createDocumentPreview("position", "company", "logo"),
  orderings: [
    {
      title: "Start date",
      name: "startDate",
      by: [{ field: "startDate", direction: "desc" }],
    },
    {
      title: "End date",
      name: "endDate",
      by: [{ field: "endDate", direction: "desc" }],
    },
  ],
  fields: [
    {
      name: "position",
      title: "Position",
      type: "string",
      required: true,
      options: {
        isHighlighted: true,
      },
    },
    {
      name: "company",
      title: "Company",
      type: "string",
    },
    {
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: (doc) => doc?.position + " " + doc?.company,
      },
    },
    {
      name: "link",
      title: "Link to company",
      type: "url",
    },
    {
      name: "logo",
      title: "Company logo",
      type: "image",
    },
    {
      name: "location",
      title: "Location",
      type: "reference",
      to: [{ type: "location" }],
    },
    {
      name: "type",
      title: "Type",
      type: "string",
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
