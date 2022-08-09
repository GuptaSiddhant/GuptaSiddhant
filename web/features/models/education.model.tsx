import clsx from "clsx"
import EducationIcon from "remixicon-react/BookFillIcon"

import type { SummaryItem } from "@gs/summary"
import type { Gallery } from "@gs/types"

import { transformSchemaInModel } from "./helpers/model.helpers"
import type { ModelStyling } from "./helpers/model.types"
import { commonCareerEducationSchema } from "./helpers/schema.helpers"
import type { Schema } from "./helpers/schema.types"

const schema: Schema = {
  type: "object",
  properties: {
    ...commonCareerEducationSchema.properties,
    degree: { type: "string", required: true },
    field: { type: "string", required: true },
    school: { type: "string", required: true },
  },
}

const model = transformSchemaInModel(schema)

const styling: ModelStyling = {
  bg: clsx("bg-red-500"),
  text: clsx("text-red-500"),
  border: clsx("border-red-500"),
  borderHocus: clsx("group-hocus:border-red-500 selected:border-red-500"),
  icon: <EducationIcon />,
}

export default { schema, model, styling }

export interface EducationProps extends Omit<SummaryItem, "title" | "model"> {
  degree: string
  field: string
  school: string
  startDate: string
  endDate?: string
  location?: string
  gallery?: Gallery
}
