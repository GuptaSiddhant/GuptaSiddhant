import clsx from "clsx"

import FormLabel from "@gs/ui/FormLabel"
import { toTitleCase } from "@gs/utils/format"

import type { EditorFormInputProps } from "./types"

export default function EditorFormBooleanInput(
  props: EditorFormInputProps<boolean>,
): JSX.Element | null {
  const { name, defaultValue = false, readOnly, required, className } = props

  const id = `${name}-checkbox`

  return (
    <FormLabel
      htmlFor={id}
      label={toTitleCase(name)}
      className={clsx(className, "justify-between py-3 sm:gap-2")}
    >
      <input
        id={id}
        type="checkbox"
        name={name}
        defaultChecked={defaultValue}
        required={required}
        readOnly={readOnly}
      />
    </FormLabel>
  )
}
