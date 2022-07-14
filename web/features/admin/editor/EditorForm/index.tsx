import { type Model } from "@gs/models"
import { type FormMethod, Form } from "@remix-run/react"
import { createContext, useContext } from "react"

import EditorFormObjectInput from "./EditorFormObjectInput"
import EditorFormTextInput from "./EditorFormTextInput"

const EditorFormContext = createContext<{ itemId: string }>({ itemId: "new" })

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
    <EditorFormContext.Provider value={{ itemId: item?.id || "new" }}>
      <Form id={formId} method={method} replace className="flex flex-col gap-4">
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
