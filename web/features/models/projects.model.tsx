import clsx from "clsx"
import ProjectsIcon from "remixicon-react/ArtboardLineIcon"

import { transformSchemaInModel } from "./model.helpers"
import type { ModelStyling } from "./model.types"
import { commonBlogProjectSchema } from "./schema.helpers"
import type { Schema } from "./schema-type"

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
