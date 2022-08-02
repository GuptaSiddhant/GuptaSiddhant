import clsx from "clsx"
import CareerIcon from "remixicon-react/Briefcase5FillIcon"

import { transformSchemaInModel } from "./model.helpers"
import type { ModelStyling } from "./model.types"
import { commonCareerEducationSchema } from "./schema.helpers"
import type { Schema } from "./schema-type"

const schema: Schema = {
  type: "object",
  properties: {
    ...commonCareerEducationSchema.properties,
    position: {
      type: "string",
    },
    company: {
      type: "string",
    },
    type: {
      type: "string",
      enum: ["full-time", "part-time", "freelancer", "intern", "contract"],
    },
  },
  required: [
    ...(commonCareerEducationSchema.required || []),
    "position",
    "company",
  ],
  additionalProperties: false,
}

const model = transformSchemaInModel(schema)

const styling: ModelStyling = {
  bg: clsx("bg-purple-500"),
  text: clsx("text-purple-500"),
  border: clsx("border-purple-500"),
  borderHocus: clsx("group-hocus:border-purple-500 selected:border-purple-500"),
  icon: <CareerIcon />,
}

export default { schema, model, styling }
