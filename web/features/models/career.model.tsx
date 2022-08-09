import clsx from "clsx"
import CareerIcon from "remixicon-react/Briefcase5FillIcon"

import type { SummaryItem } from "@gs/summary"
import type { Gallery } from "@gs/types"

import { commonCareerEducationModel } from "./helpers"
import type { Model, ModelStyling } from "./helpers/model.types"

const model: Model = {
  type: "object",
  properties: {
    ...commonCareerEducationModel.properties,
    position: { type: "string", required: true, size: "medium" },
    company: { type: "string", required: true, size: "medium" },
    type: {
      type: "string",
      enum: ["full-time", "part-time", "freelancer", "intern", "contract"],
    },
  },
}

const styling: ModelStyling = {
  bg: clsx("bg-purple-500"),
  text: clsx("text-purple-500"),
  border: clsx("border-purple-500"),
  borderHocus: clsx("group-hocus:border-purple-500 selected:border-purple-500"),
  icon: <CareerIcon />,
}

export default { model, styling }

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
