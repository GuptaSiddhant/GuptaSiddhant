import { ArrayField, ImageField } from "../helpers/schema-type";

export const imageField: ImageField = {
  name: "image",
  type: "image",
  options: { hotspot: true },
  fields: [
    {
      name: "caption",
      type: "string",
      title: "Caption",
      options: {
        isHighlighted: true,
      },
    },
  ],
};

export const galleryField: ArrayField = {
  name: "gallery",
  title: "Gallery",
  type: "array",
  of: [imageField],
};
