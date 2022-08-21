import clsx from "clsx"

import { type Model, ModelSize } from "@gs/models/types"

export const objectGridClassName = clsx(
  "grid grid-flow-row-dense gap-4",
  "grid-cols-2 md:grid-cols-4 xl:grid-cols-6",
  "col-span-full",
)

export const fieldsetClassName = clsx("rounded border p-2 group")

export const requiredLabelClassName = (required?: boolean) =>
  clsx(required && "after:text-negative after:content-['_*']")

export const sortRequiredPredicate = (a: [string, Model], b: [string, Model]) =>
  a[1].required ? -1 : b[1].required ? 1 : a[0].localeCompare(b[0])

export function generateColumnClassNameForModeSize(size?: ModelSize) {
  return clsx(
    size === ModelSize.FULL
      ? "col-span-full"
      : size === ModelSize.LARGE
      ? "col-span-full md:col-span-3"
      : size === ModelSize.MEDIUM
      ? "col-span-2"
      : "col-span-1",
  )
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
  )
}
