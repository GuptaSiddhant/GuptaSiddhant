import clsx from "clsx"
import { useState } from "react"

import { type Language, supportedLanguages } from "@gs/helpers/code-lang"
import useFullscreen from "@gs/hooks/useFullscreen"
import Accordion from "@gs/ui/Accordion"
import { FullscreenButton } from "@gs/ui/Button"
import CodeBlock from "@gs/ui/CodeBlock"
import Select from "@gs/ui/Select"

import { requiredLabelClassName } from "./helpers"
import { useEditorFormContext } from "./index"
import type { EditorFormInputProps } from "./types"

export default function EditorFormCodeInput({
  name,
  defaultValue = "",
  required,
  className,
}: EditorFormInputProps<string>) {
  const fullscreenProps = useFullscreen<HTMLDetailsElement>()
  const [value, setValue] = useState<string>(defaultValue)
  const [lang, setLang] = useState<Language>("bash")

  const itemId = useEditorFormContext().itemId

  return (
    <Accordion
      summary={
        <span className={requiredLabelClassName(required)}>
          {fullscreenProps.isFullscreen ? `${itemId}'s ${name}` : name}
        </span>
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
          "grid gap-2 rounded-sm border border-divider bg-default p-0 md:grid-cols-2",
          fullscreenProps.isFullscreen ? "h-[calc(100vh_-_2.5rem)]" : className,
        )}
      >
        <textarea
          name={name}
          defaultValue={defaultValue}
          onChange={(e) => setValue(e.target.value)}
          required={required}
          placeholder="Enter markdown here"
          className={clsx(
            "h-full w-full resize-none overflow-auto rounded bg-secondary p-2 font-monospace text-sm",
          )}
        />

        <CodeBlock className="!m-0" wrap hideBadge lang={lang}>
          {value}
        </CodeBlock>
      </div>
    </Accordion>
  )
}
