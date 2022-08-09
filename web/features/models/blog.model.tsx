import clsx from "clsx"
import BlogIcon from "remixicon-react/QuillPenLineIcon"

import type { SummaryItem } from "@gs/summary"
import type { Gallery } from "@gs/types"

import { commonBlogProjectModel } from "./helpers"
import type { Model, ModelStyling } from "./helpers/model.types"

const model: Model = {
  type: "object",
  properties: {
    ...commonBlogProjectModel.properties,
    date: { type: "string", required: true },
  },
}

const styling: ModelStyling = {
  bg: clsx("bg-blue-500"),
  text: clsx("text-blue-500"),
  border: clsx("border-blue-500"),
  borderHocus: clsx("group-hocus:border-blue-500 selected:border-blue-500"),
  icon: <BlogIcon />,
}

export default { model, styling }

export interface BlogPostProps extends SummaryItem {
  content?: string
  gallery?: Gallery
}
