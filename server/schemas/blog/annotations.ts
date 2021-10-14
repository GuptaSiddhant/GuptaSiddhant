import type { ObjectType, Field, ArrayField } from "../../helpers/schema-type";

const externalLinkAnnotation: ObjectType = {
  title: "External Link",
  name: "externalLink",
  type: "object",
  // blockEditor: {icon: <External/>},
  fields: [
    {
      title: "URL",
      name: "href",
      type: "url",
      validation: (Rule) =>
        Rule.uri({
          allowRelative: true,
          scheme: ["https", "http", "mailto", "tel"],
        }),
    },
  ],
};

const internalLinkAnnotation: ObjectType = {
  title: "Internal link",
  name: "internalLink",
  type: "object",
  // blockEditor: {icon: <Link/>},
  fields: [
    {
      name: "reference",
      type: "reference",
      to: [
        { type: "career" },
        { type: "education" },
        { type: "project" },
        { type: "blog" },
      ],
    },
  ],
};

const blockAnnotations: Field[] = [
  externalLinkAnnotation,
  internalLinkAnnotation,
];

export const blogContentField: ArrayField = {
  name: "content",
  title: "Content",
  type: "array",
  of: [
    {
      type: "block",
      marks: {
        annotations: blockAnnotations,
      },
    },
    { type: "imageWithCaption" },
    { type: "code" },
    { type: "mdx" },
  ],
};
