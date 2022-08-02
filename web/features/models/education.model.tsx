import clsx from "clsx"
import EducationIcon from "remixicon-react/BookFillIcon"

import { transformSchemaInModel } from "./model.helpers"
import type { ModelStyling } from "./model.types"
import { commonCareerEducationSchema } from "./schema.helpers"
import type { Schema } from "./schema-type"

const schema: Schema = {
  type: "object",
  properties: {
    ...commonCareerEducationSchema.properties,
    degree: {
      type: "string",
    },
    field: {
      type: "string",
    },
    school: {
      type: "string",
    },
  },
  required: [
    ...(commonCareerEducationSchema.required || []),
    "degree",
    "field",
    "school",
  ],
  additionalProperties: false,
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
