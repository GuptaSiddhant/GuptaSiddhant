import clsx from "clsx"
import BlogIcon from "remixicon-react/QuillPenLineIcon"

import { transformSchemaInModel } from "./model.helpers"
import type { ModelStyling } from "./model.types"
import { commonBlogProjectSchema } from "./schema.helpers"
import type { Schema } from "./schema-type"

const schema: Schema = {
  type: "object",
  properties: {
    ...commonBlogProjectSchema.properties,
    date: {
      type: "string",
    },
  },
  required: [...(commonBlogProjectSchema.required || []), "date"],
}

const model = transformSchemaInModel(schema)

const styling: ModelStyling = {
  bg: clsx("bg-blue-500"),
  text: clsx("text-blue-500"),
  border: clsx("border-blue-500"),
  borderHocus: clsx("group-hocus:border-blue-500 selected:border-blue-500"),
  icon: <BlogIcon />,
}

export default { schema, model, styling }
