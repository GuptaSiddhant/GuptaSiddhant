import clsx from "clsx";
import { useState } from "react";

import useFullscreen from "@gs/hooks/useFullscreen";
import type { ModelStringType } from "@gs/models/helpers/types";
import Accordion from "@gs/ui/Accordion";
import { FullscreenButton } from "@gs/ui/Button";
import CodeBlock from "@gs/ui/CodeBlock";
import Mdx from "@gs/ui/Mdx";
import Select from "@gs/ui/Select";
import { type Language, supportedLanguages } from "@gs/utils/code-lang";

import { useEditorForm } from "./context";
import {
  EditorInputLabel,
  generateInputHeightClassNameForModeSize,
} from "./helpers";

export interface EditorPreviewInputProps {
  name: string;
  model: ModelStringType;
  data?: string;
  readonly?: boolean;
  className?: string;
}

export default function EditorPreviewInput(
  props: EditorPreviewInputProps,
): JSX.Element | null {
  if (props.model.format === "markdown") {
    return <EditorMarkdownInput {...props} />;
  }

  if (props.model.format === "code") {
    return <EditorFormCodeInput {...props} />;
  }

  return null;
}

function EditorMarkdownInput(
  props: EditorPreviewInputProps,
): JSX.Element | null {
  const { name, className, data, model } = props;
  const { required, size } = model;

  const { itemId } = useEditorForm();
  const fullscreenProps = useFullscreen<HTMLDetailsElement>();
  const [value, setValue] = useState<string | undefined>(data);

  return (
    <Accordion
      summary={
        <EditorInputLabel
          name={fullscreenProps.isFullscreen ? `${itemId}'s ${name}` : name}
          required={required}
        />
      }
      open="always"
      summaryClassName="!m-0"
      summaryLeadingElement={<FullscreenButton {...fullscreenProps} />}
      accordionRef={fullscreenProps.targetRef}
      className="col-span-full"
    >
      <div
        className={clsx(
          className,
          "grid gap-2 rounded-sm border border-divider bg-default p-0 md:grid-cols-2",
          fullscreenProps.isFullscreen
            ? "h-[calc(100vh_-_2.5rem)]"
            : generateInputHeightClassNameForModeSize(size),
        )}
      >
        <textarea
          name={name}
          defaultValue={value}
          onChange={(e) => setValue(e.target.value)}
          required={required}
          placeholder="Enter markdown here"
          className={clsx(
            "h-full w-full resize-none overflow-auto rounded bg-secondary p-2 font-monospace text-sm",
          )}
        />
        <div className="prose prose-sm mx-auto hidden h-full w-full overflow-y-auto overflow-x-hidden rounded-sm bg-primary p-2 dark:prose-invert md:block">
          <Mdx mdx={value} lazyLoadImages={false} />
        </div>
      </div>
    </Accordion>
  );
}

function EditorFormCodeInput(
  props: EditorPreviewInputProps,
): JSX.Element | null {
  const { name, className, data, model } = props;
  const { required, size } = model;

  const fullscreenProps = useFullscreen<HTMLDetailsElement>();
  const [value, setValue] = useState<string | undefined>(data);
  const [lang, setLang] = useState<Language>("bash");

  const { itemId } = useEditorForm();

  return (
    <Accordion
      summary={
        <EditorInputLabel
          name={fullscreenProps.isFullscreen ? `${itemId}'s ${name}` : name}
          required={required}
        />
      }
      open="always"
      summaryClassName={clsx("!m-0")}
      summaryLeadingElement={
        <>
          <Select
            value={lang}
            onChange={(e) => setLang(e.currentTarget.value as Language)}
          >
            {supportedLanguages.map(({ lang }) => (
              <Select.Option key={lang} value={lang}>
                {lang}
              </Select.Option>
            ))}
          </Select>
          <FullscreenButton {...fullscreenProps} />
        </>
      }
      accordionRef={fullscreenProps.targetRef}
      className="col-span-full"
    >
      <div
        className={clsx(
          className,
          "grid gap-2 rounded-sm border border-divider bg-default p-0 md:grid-cols-2",
          fullscreenProps.isFullscreen
            ? "h-[calc(100vh_-_2.5rem)]"
            : generateInputHeightClassNameForModeSize(size),
        )}
      >
        <textarea
          name={name}
          defaultValue={value}
          onChange={(e) => setValue(e.target.value)}
          required={required}
          placeholder="Enter markdown here"
          className={clsx(
            "h-full w-full resize-none overflow-auto rounded bg-secondary p-2 font-monospace text-sm",
          )}
        />

        <CodeBlock className="!m-0" wrap hideBadge lang={lang}>
          {value || ""}
        </CodeBlock>
      </div>
    </Accordion>
  );
}
