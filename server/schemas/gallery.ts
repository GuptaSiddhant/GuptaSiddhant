import { ArrayField, ImageField } from "../helpers/schema-type";

export const ImageWithCaption: ImageField = {
  title: "Image with caption",
  name: "imageWithCaption",
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

export const FileWithCaption: ImageField = {
  title: "File with caption",
  name: "fileWithCaption",
  type: "file",
  fields: [
    {
      name: "title",
      type: "string",
      title: "Title",
    },
    {
      name: "caption",
      type: "string",
      title: "Caption",
    },
  ],
};

export const galleryField: ArrayField = {
  name: "gallery",
  title: "Gallery",
  type: "array",
  of: [ImageWithCaption],
};

export const filesField: ArrayField = {
  name: "files",
  title: "Files",
  type: "array",
  of: [FileWithCaption],
};
