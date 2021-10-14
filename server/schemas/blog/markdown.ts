import type { ObjectType } from "../../helpers/schema-type";

export const MarkdownBlock: ObjectType = {
  name: "mdx",
  title: "Markdown",
  type: "object",
  fields: [
    { type: "string", name: "title", title: "Title" },
    { type: "markdown", name: "value", title: "Content" },
  ],
};
