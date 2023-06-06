import clsx from "clsx";

import { Form } from "@remix-run/react";

import { type Model } from "@gs/models";

import EditorObjectInput from "./EditorObjectInput";
import EditorTextInput from "./EditorScalerInput";
import { objectGridClassName } from "./helpers";

export interface EditorFormProps<T extends Record<string, unknown>> {
  formId: string;
  data?: T;
  model: Model;
}

export default function EditorForm<T extends { id: string }>({
  data,
  model,
  formId,
}: EditorFormProps<T>): JSX.Element | null {
  // Every form is represented in an object form.
  if (model.type !== "object") {
    return null;
  }

  return (
    <Form
      id={formId}
      method={"POST"}
      replace
      className={clsx(objectGridClassName)}
    >
      {data?.id ? (
        <input type="hidden" name="id" value={data?.id} />
      ) : (
        <EditorTextInput
          name="id"
          model={{ type: "string", required: true }}
          data=""
          className="!col-span-full"
        />
      )}

      <EditorObjectInput data={data} model={model} />
    </Form>
  );
}
