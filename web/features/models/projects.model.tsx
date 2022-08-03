import clsx from "clsx"
import ProjectsIcon from "remixicon-react/ArtboardLineIcon"

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
    dateStart: {
      type: "string",
    },
    dateEnd: {
      type: "string",
    },
    association: {
      type: "string",
    },
  },
  required: [...(commonBlogProjectSchema.required || []), "dateStart"],
}

const model = transformSchemaInModel(schema)

const styling: ModelStyling = {
  bg: clsx("bg-green-500"),
  text: clsx("text-green-500"),
  border: clsx("border-green-500"),
  borderHocus: clsx("group-hocus:border-green-500 selected:border-green-500"),
  icon: <ProjectsIcon />,
}

export default { schema, model, styling }

export interface ProjectProps extends SummaryItem {
  association?: string
  dateEnd?: string
  dateStart: string
  content?: string
  gallery?: Gallery
}
