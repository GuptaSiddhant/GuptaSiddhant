import clsx from "clsx";

import { type Model, ModelSize } from "@gs/models/types";
import { toTitleCase } from "@gs/utils/format";

export const objectGridClassName = clsx(
  "grid grid-flow-row-dense gap-4",
  "grid-cols-2 md:grid-cols-4 xl:grid-cols-6",
  "col-span-full",
);

export const fieldsetClassName = clsx("rounded border p-2 group");

export function requiredLabelClassName(required?: boolean) {
  return clsx(required && "after:text-negative after:content-['_*']");
}

export function sortPredicate(
  [a, aModel]: [string, Model],
  [b, bModel]: [string, Model],
) {
  // Z->A type: string > object > number > boolean > array
  const typeComparison = bModel.type.localeCompare(aModel.type);
  if (typeComparison !== 0) {
    return typeComparison;
  }

  // Required first
  if (bModel.required && !aModel.required) {
    return 1;
  }
  if (aModel.required && !bModel.required) {
    return -1;
  }

  // A->Z field name
  const nameComparison = a.localeCompare(b);
  return nameComparison;
}

export function generateColumnClassNameForModeSize(size?: ModelSize) {
  return clsx(
    size === ModelSize.FULL
      ? "col-span-full"
      : size === ModelSize.LARGE
      ? "col-span-full md:col-span-3"
      : size === ModelSize.MEDIUM
      ? "col-span-2"
      : "col-span-1",
  );
}

export function generateInputHeightClassNameForModeSize(size?: ModelSize) {
  return clsx(
    size === ModelSize.FULL
      ? "h-screen"
      : size === ModelSize.LARGE
      ? "h-[75vh]"
      : size === ModelSize.SMALL
      ? "h-[25vh]"
      : "h-[50vh]",
  );
}

export function EditorInputLabel({
  name,
  required,
}: {
  name: string;
  required?: boolean;
}): JSX.Element | null {
  return (
    <span className={clsx("text-sm", requiredLabelClassName(required))}>
      {toTitleCase(name.split(".").at(-1) || name)}
    </span>
  );
}
