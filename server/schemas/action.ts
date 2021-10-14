import { ArrayField, ObjectType } from "../helpers/schema-type";

export const Action: ObjectType = {
  name: "action",
  title: "Action",
  type: "object",
  fields: [
    { name: "title", title: "Title", type: "string" },
    { name: "link", title: "URL", type: "url" },
  ],
};

export const actionsField: ArrayField = {
  name: "actions",
  title: "Actions",
  type: "array",
  of: [Action],
};
