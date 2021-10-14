import { createDocumentPreview } from "../helpers/schema-helpers";
import type { Document } from "../helpers/schema-type";

export const LocationDocument: Document = {
  name: "location",
  title: "Location",
  type: "document",
  fields: [
    {
      name: "city",
      title: "City",
      type: "string",
    },
    {
      name: "country",
      title: "Country",
      type: "string",
    },
  ],
  preview: createDocumentPreview("city", "country"),
};
