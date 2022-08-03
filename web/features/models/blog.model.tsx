import clsx from "clsx"
import BlogIcon from "remixicon-react/QuillPenLineIcon"

import type { SummaryItem } from "@gs/summary"
import type { Gallery } from "@gs/types"

import { transformSchemaInModel } from "./helpers/model.helpers"
import type { ModelStyling } from "./helpers/model.types"
import { commonBlogProjectSchema } from "./helpers/schema.helpers"
import type { Schema } from "./helpers/schema.types"

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

export interface BlogPostProps extends SummaryItem {
  content?: string
  gallery?: Gallery
}
