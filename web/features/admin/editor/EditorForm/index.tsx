import clsx from "clsx"
import { createContext, useContext } from "react"

import { type FormMethod, Form } from "@remix-run/react"

import { type Model } from "@gs/models"

import EditorFormObjectInput from "./EditorFormObjectInput"
import EditorFormTextInput from "./EditorFormTextInput"

const EditorFormContext = createContext<{ itemId: string; newItem?: boolean }>({
  itemId: "new",
})

export interface EditorFormProps<T extends Record<string, any>> {
  method: FormMethod
  formId: string
  item?: T
  model: Model
}

export default function EditorForm<T extends { id: string }>({
  method,
  item,
  model,
  formId,
}: EditorFormProps<T>): JSX.Element | null {
  return (
    <EditorFormContext.Provider
      value={{ itemId: item?.id || "new", newItem: !item?.id }}
    >
      <Form
        id={formId}
        method={method}
        replace
        className={clsx(
          "grid grid-flow-row-dense gap-4",
          "grid-cols-2 md:grid-cols-4 xl:grid-cols-6",
        )}
      >
        {item?.id ? (
          <input type="hidden" name="id" value={item.id} />
        ) : (
          <EditorFormTextInput name="id" defaultValue={""} required />
        )}
        <EditorFormObjectInput item={item} properties={model.properties} />
      </Form>
    </EditorFormContext.Provider>
  )
}

export function useEditorFormContext() {
  return useContext(EditorFormContext)
}
