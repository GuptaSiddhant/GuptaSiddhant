import clsx from "clsx";

import type {
  ModelArrayType,
  ModelObjectType,
  ModelScalerType,
  ModelStringType,
} from "@gs/models/helpers/types";

import EditorArrayInput from "./EditorArrayInput";
import EditorPreviewInput from "./EditorPreviewInput";
import EditorTextInput from "./EditorScalerInput";
import { EditorFormContextProvider, useEditorForm } from "./context";
import {
  EditorInputLabel,
  fieldsetClassName,
  objectGridClassName,
  sortPredicate,
} from "./helpers";

export interface EditorObjectInputProps<V = unknown, T = Record<string, V>> {
  data?: T;
  model: ModelObjectType;
  prefix?: string;
}

export default function EditorObjectInput<T extends { id?: string }>(
  props: EditorObjectInputProps<string, T>,
): JSX.Element | null {
  const id = props.data?.id;

  return (
    <EditorFormContextProvider
      itemId={id || "new"}
      newItem={!id}
      prefix={props.prefix}
    >
      <ScalerInputs {...props} />
      <ArrayInputs {...props} />
      <PreviewInputs {...props} />
      <ObjectInputs {...props} />
    </EditorFormContextProvider>
  );
}

function ScalerInputs(props: EditorObjectInputProps): JSX.Element | null {
  const { addPrefix } = useEditorForm();
  const entries = Object.entries(props.model.properties)
    .filter(
      ([name, model]) =>
        name !== "id" &&
        ((model.type === "string" && !model.format) ||
          model.type === "number" ||
          model.type === "boolean"),
    )
    .sort(sortPredicate) as Array<[string, ModelScalerType]>;

  return (
    <>
      {entries.map(([name, model]) => (
        <EditorTextInput
          key={addPrefix(name)}
          name={addPrefix(name)}
          data={props.data?.[name]}
          model={model}
        />
      ))}
    </>
  );
}

function ArrayInputs(props: EditorObjectInputProps): JSX.Element | null {
  const { addPrefix } = useEditorForm();
  const entries = Object.entries(props.model.properties)
    .filter(([_, model]) => model.type === "array")
    .sort(sortPredicate) as Array<[string, ModelArrayType]>;

  return (
    <>
      {entries.map(([name, model]) => (
        <EditorArrayInput
          key={addPrefix(name)}
          name={addPrefix(name)}
          data={props.data?.[name] as unknown[]}
          model={model}
        />
      ))}
    </>
  );
}

function PreviewInputs(
  props: EditorObjectInputProps<string>,
): JSX.Element | null {
  const { addPrefix } = useEditorForm();
  const entries = Object.entries(props.model.properties)
    .filter(([_, model]) => model.type === "string" && !!model.format)
    .sort(sortPredicate) as Array<[string, ModelStringType]>;

  return (
    <>
      {entries.map(([name, model]) => (
        <EditorPreviewInput
          key={addPrefix(name)}
          name={addPrefix(name)}
          data={props.data?.[name]}
          model={model}
        />
      ))}
    </>
  );
}

function ObjectInputs(props: EditorObjectInputProps): JSX.Element | null {
  const { addPrefix } = useEditorForm();
  const entries = Object.entries(props.model.properties)
    .filter(([_, model]) => model.type === "object")
    .sort(sortPredicate) as Array<[string, ModelObjectType]>;

  return (
    <>
      {entries.map(([name, model]) => (
        <fieldset
          aria-required={model.required}
          key={addPrefix(name)}
          className={clsx(objectGridClassName, fieldsetClassName)}
        >
          <legend className="px-1 text-base">
            <EditorInputLabel name={name} required={model.required} />
          </legend>

          <EditorObjectInput
            data={props.data?.[name] as { id?: string }}
            model={model}
            prefix={name}
          />
        </fieldset>
      ))}
    </>
  );
}
