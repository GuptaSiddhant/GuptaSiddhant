import clsx from "clsx"

import type { Model } from "@gs/models/helpers/model.types"

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
