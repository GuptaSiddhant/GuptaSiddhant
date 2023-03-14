import clsx from "clsx";
import { useState } from "react";

import { DeleteIcon } from "@gs/icons";
import type { ModelArrayType, ModelObjectType } from "@gs/models/helpers/types";
import Button from "@gs/ui/Button";

import EditorObjectInput from "./EditorObjectInput";
import EditorScalerInput from "./EditorScalerInput";
import {
  EditorInputLabel,
  fieldsetClassName,
  objectGridClassName,
} from "./helpers";

export interface EditorArrayInputProps {
  name: string;
  model: ModelArrayType;
  data?: unknown[];
}

export default function EditorArrayInput(
  props: EditorArrayInputProps,
): JSX.Element | null {
  const { name, data = [], model } = props;
  const { required, items: itemModel } = model;

  if (itemModel.type === "object") {
    return <EditorObjectList name={name} data={data} model={itemModel} />;
  }

  return (
    <EditorScalerInput
      name={name}
      data={data.toString()}
      model={itemModel}
      placeholder={`Comma separated values (${itemModel.type})`}
      className="!col-span-full"
      required={required}
    />
  );

  // throw new Error("Nested arrays are not supported")
}

function EditorObjectList(props: {
  name: string;
  model: ModelObjectType;
  data: unknown[];
}): JSX.Element | null {
  const { name, data = [], model } = props;
  const { required } = model;

  const [list, setList] = useState(data);

  const handleAdd = () => setList((l) => [...l, {}]);
  const handleRemove = (index: number) =>
    setList(list.filter((_, i) => i !== index));

  return (
    <fieldset
      id={name}
      className={clsx("col-span-full flex flex-col gap-2", fieldsetClassName)}
      aria-required={required}
    >
      <legend className="px-1 text-base">
        <EditorInputLabel name={name} required={required} />
      </legend>

      <ol>
        {list.map((item, index) => {
          const key = `${name}.${index}`;

          return (
            <li
              key={key}
              id={key}
              className={clsx("flex w-full gap-4 border-b py-2")}
            >
              <div className="flex flex-col gap-2 text-sm text-disabled">
                {(index + 1).toString().padStart(2, "0")}
                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  title="Delete item"
                >
                  <DeleteIcon className="scale-90" />
                </button>
              </div>
              <div className={clsx("flex-1", objectGridClassName)}>
                <EditorObjectInput
                  data={item as { id?: string } | undefined}
                  model={model}
                  prefix={key}
                />
              </div>
            </li>
          );
        })}
      </ol>

      <Button.Secondary
        className="w-max text-sm"
        type="button"
        onClick={handleAdd}
      >
        + Add item
      </Button.Secondary>
    </fieldset>
  );
}
