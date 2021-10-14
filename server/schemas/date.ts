import { Field } from "../helpers/schema-type";

export const dateFields: Field[] = [
  {
    name: "startDate",
    title: "Start date",
    type: "date",
  },
  {
    name: "isCurrent",
    title: "Current",
    type: "boolean",
    initialValue: false,
  },
  {
    name: "endDate",
    title: "End date",
    type: "date",
    hidden: ({ document }) => Boolean(document?.isCurrent),
  },
];
