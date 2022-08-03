import clsx from "clsx"
import CareerIcon from "remixicon-react/Briefcase5FillIcon"

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

export enum CareerRoleType {
  FullTime = "full-time",
  PartTime = "part-time",
  Freelancer = "freelancer",
  Intern = "intern",
  Contract = "contract",
}

export interface CareerProps extends Omit<SummaryItem, "title" | "model"> {
  position: string
  company: string
  type?: CareerRoleType
  gallery?: Gallery
  startDate: string
  endDate?: string
  location?: string
}
