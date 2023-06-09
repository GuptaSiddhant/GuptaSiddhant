import clsx from "clsx";
import { useCallback } from "react";

import type { ModelScalerType } from "@gs/models/helpers/types";
import FormLabel from "@gs/ui/FormLabel";
import Input from "@gs/ui/Input";
import Select from "@gs/ui/Select";
import { formatYYYYMMDD } from "@gs/utils/format";

import {
  EditorInputLabel,
  generateColumnClassNameForModeSize,
} from "./helpers";

// rome-ignore lint/suspicious/noExplicitAny: Complicated // todo
export interface EditorScalerInputProps<T = any> {
  name: string;
  model: ModelScalerType;
  data: T;
  readonly?: boolean;
  required?: boolean;
  className?: string;
  placeholder?: string;
  onChange?: (key: string, value: T) => void;
}

export default function EditorScalerInput(
  props: EditorScalerInputProps,
): JSX.Element | null {
  const { name, model } = props;

  if (model.type === "boolean") {
    return <EditorCheckboxInput {...props} />;
  }

  if (model.type !== "string" && model.type !== "number") {
    return null;
  }

  const options = model.type === "string" ? model.enum || [] : [];
  if (options.length > 0) {
    return <EditorSelectInput {...props} options={options} />;
  }

  const isDate = name.toLowerCase().includes("date");
  if (isDate) {
    return <EditorDateInput {...props} />;
  }

  const isDescription = name.toLowerCase().includes("description");
  if (isDescription) {
    return <EditorMultiLineTextInput {...props} />;
  }

  return <EditorSingleLineTextInput {...props} />;
}

function EditorSingleLineTextInput(
  props: EditorScalerInputProps<string>,
): JSX.Element | null {
  const { name, model, data, className, placeholder, onChange } = props;
  const required = props.required || model.required;
  const readonly = props.readonly || model.readonly;

  const isUrl = name.toLowerCase().includes("url");
  const isEmail = name.toLowerCase().includes("email");
  const placeholderText =
    placeholder || (isUrl ? "https://" : isEmail ? "abc@xyx" : "");

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(name, event.currentTarget.value);
    },
    [onChange, name],
  );

  return (
    <Input
      id={name}
      label={<EditorInputLabel name={name} required={required} />}
      labelClassName={clsx(
        className,
        generateColumnClassNameForModeSize(model.size),
        "flex flex-col",
      )}
      className={"w-full"}
      name={name}
      defaultValue={readonly ? undefined : data}
      value={readonly ? data : undefined}
      required={required}
      readOnly={readonly}
      placeholder={placeholderText}
      type={isEmail ? "email" : "text"}
      onChange={handleChange}
    />
  );
}

function EditorMultiLineTextInput(
  props: EditorScalerInputProps<string>,
): JSX.Element | null {
  const { name, model, data, readonly, className, onChange } = props;
  const required = props.required || model.required;

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      onChange?.(name, event.currentTarget.value);
    },
    [onChange, name],
  );

  return (
    <FormLabel
      htmlFor={name}
      label={<EditorInputLabel name={name} required={required} />}
      className={clsx(
        className,
        generateColumnClassNameForModeSize(model.size),
        "row-span-2",
      )}
      vertical
    >
      <textarea
        id={name}
        className="h-full w-full resize-none bg-transparent p-2"
        name={name}
        defaultValue={data}
        required={required}
        readOnly={readonly}
        placeholder="Enter description here"
        onChange={handleChange}
      />
    </FormLabel>
  );
}

function EditorDateInput(
  props: EditorScalerInputProps<string>,
): JSX.Element | null {
  const { name, model, data, readonly, className, onChange } = props;
  const required = props.required || model.required;

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const date = formatYYYYMMDD(new Date(event.currentTarget.value));
      date && onChange?.(name, date);
    },
    [onChange, name],
  );

  return (
    <Input
      id={name}
      label={<EditorInputLabel name={name} required={required} />}
      labelClassName={clsx(
        className,
        generateColumnClassNameForModeSize(model.size),
        "flex flex-col",
      )}
      type="date"
      pattern="^\\d{4}-\\d{2}-\\d{2}$"
      placeholder="YYYY-MM-DD"
      name={name}
      required={required}
      readOnly={readonly}
      defaultValue={data ? formatYYYYMMDD(new Date(data)) : undefined}
      onChange={handleChange}
    />
  );
}

function EditorSelectInput(
  props: EditorScalerInputProps<string> & { options?: string[] },
): JSX.Element | null {
  const {
    name,
    model,
    data,
    readonly,
    className,
    options = [],
    onChange,
  } = props;
  const required = props.required || model.required;

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      onChange?.(name, event.currentTarget.value);
    },
    [onChange, name],
  );

  return (
    <Select
      id={name}
      label={<EditorInputLabel name={name} required={required} />}
      className={clsx(
        className,
        generateColumnClassNameForModeSize(model.size),
      )}
      name={name}
      disabled={readonly}
      defaultValue={data}
      vertical
      required={required}
      onChange={handleChange}
    >
      {options.map((option) => (
        <Select.Option key={option} value={option}>
          {option}
        </Select.Option>
      ))}
    </Select>
  );
}

function EditorCheckboxInput(
  props: EditorScalerInputProps<boolean>,
): JSX.Element | null {
  const { name, className, data, readonly, model, onChange } = props;
  const required = props.required || model.required;

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(name, event.currentTarget.checked);
    },
    [onChange, name],
  );

  return (
    <FormLabel
      htmlFor={name}
      label={<EditorInputLabel name={name} required={required} />}
      className={clsx(
        className,
        generateColumnClassNameForModeSize(model.size),
        "justify-between py-3 sm:gap-2",
      )}
    >
      <input
        id={name}
        type="checkbox"
        name={name}
        defaultChecked={data}
        required={required}
        readOnly={readonly}
        onChange={handleChange}
      />
    </FormLabel>
  );
}
