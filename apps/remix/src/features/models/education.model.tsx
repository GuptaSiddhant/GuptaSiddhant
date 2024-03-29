import clsx from "clsx";
import EducationIcon from "remixicon-react/BookFillIcon";

import type { SummaryItem } from "@gs/summary";
import type { Gallery } from "@gs/types";

import { commonCareerEducationModel } from "./helpers/common-models";
import {
  type ModelObjectType,
  ModelSize,
  type ModelStyling,
} from "./helpers/types";

export const model: ModelObjectType = {
  type: "object",
  properties: {
    ...commonCareerEducationModel.properties,
    degree: { type: "string", required: true, size: ModelSize.MEDIUM },
    field: { type: "string", required: true, size: ModelSize.MEDIUM },
    school: { type: "string", required: true, size: ModelSize.MEDIUM },
  },
};

export const styling: ModelStyling = {
  bg: clsx("bg-red-500"),
  text: clsx("text-red-500"),
  border: clsx("border-red-500"),
  borderHocus: clsx("group-hocus:border-red-500 selected:border-red-500"),
  icon: <EducationIcon />,
};

export interface EducationProps extends Omit<SummaryItem, "title" | "model"> {
  degree: string;
  field: string;
  school: string;
  startDate: string;
  endDate?: string;
  location?: string;
  gallery?: Gallery;
}

export { EducationIcon };
