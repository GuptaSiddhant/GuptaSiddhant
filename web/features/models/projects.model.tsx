import clsx from "clsx"
import ProjectsIcon from "remixicon-react/ArtboardLineIcon"

import type { SummaryItem } from "@gs/summary"
import type { Gallery } from "@gs/types"

import { commonBlogProjectModel } from "./helpers"
import type { Model, ModelStyling } from "./helpers/model.types"

const model: Model = {
  type: "object",
  properties: {
    ...commonBlogProjectModel.properties,
    dateStart: { type: "string", required: true },
    dateEnd: { type: "string" },
    association: { type: "string", size: "medium" },
  },
}

const styling: ModelStyling = {
  bg: clsx("bg-green-500"),
  text: clsx("text-green-600"),
  border: clsx("border-green-500"),
  borderHocus: clsx("group-hocus:border-green-500 selected:border-green-500"),
  icon: <ProjectsIcon />,
}

export default { model, styling }

export interface ProjectProps extends SummaryItem {
  association?: string
  dateEnd?: string
  dateStart: string
  content?: string
  gallery?: Gallery
}
