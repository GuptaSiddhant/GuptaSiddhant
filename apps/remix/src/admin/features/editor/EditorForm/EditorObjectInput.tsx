import clsx from "clsx";
import { useCallback, useMemo, useState } from "react";

import type {
  ModelArrayType,
  ModelObjectType,
  ModelScalerType,
  ModelStringType,
} from "@gs/models/helpers/types";
import { ModelSize, ModelTitle } from "@gs/models/helpers/types";

import EditorArrayInput from "./EditorArrayInput";
import EditorImageMetadata from "./EditorImageMetadata";
import EditorPreviewInput from "./EditorPreviewInput";
import EditorTextInput from "./EditorScalerInput";
import { EditorFormContextProvider, useEditorForm } from "./context";
import {
  EditorInputLabel,
  fieldsetClassName,
  objectGridClassName,
  sortPredicate,
} from "./helpers";
import type { BlurhashData } from "@gs/utils/blurhash.client";

export interface EditorObjectInputProps<V = unknown, T = Record<string, V>> {
  data?: T;
  model: ModelObjectType;
  prefix?: string;
  onChange?: (key: string, data: T) => void;
}

export default function EditorObjectInput<T extends { id?: string }>(
  props: EditorObjectInputProps<string, T>,
): JSX.Element | null {
  const { model, data, prefix } = props;
  const id = data?.id;
  const [state, setState] = useState<T | undefined>(data);

  const isImageObject = model.title === ModelTitle.Image;
  const imageUrl =
    state && isImageObject && "url" in state && typeof state.url === "string"
      ? state.url
      : undefined;

  const handleChange = useCallback(
    (key: string, value: unknown) => {
      if (typeof value !== "string") return;
      if (isImageObject && key.endsWith(".url") && typeof value === "string") {
        setState((prev) => (prev ? { ...prev, url: value } : prev));
      }
    },
    [isImageObject],
  );

  const handleSetMetadata = useCallback(
    (metadata: BlurhashData) =>
      setState((prev) => (prev ? { ...prev, metadata } : prev)),
    [],
  );
  const imageMetadata = useMemo(
    () =>
      state && "metadata" in state
        ? (state?.metadata as BlurhashData)
        : undefined,
    [state],
  );

  return (
    <EditorFormContextProvider
      itemId={id || "new"}
      newItem={!id}
      prefix={prefix}
    >
      <ScalerInputs data={state} model={model} onChange={handleChange} />
      <ArrayInputs data={state} model={model} />
      <PreviewInputs data={state} model={model} />
      <ObjectInputs data={state} model={model} />

      <EditorImageMetadata
        imageUrl={imageUrl}
        setMetadata={handleSetMetadata}
        prefix={prefix}
        metadata={imageMetadata}
      />
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
          onChange={props.onChange}
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
      {entries.map(([name, model]) =>
        model.size === ModelSize.NONE ? null : (
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
        ),
      )}
    </>
  );
}
