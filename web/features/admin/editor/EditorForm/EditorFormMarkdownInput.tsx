import clsx from "clsx"
import { useState } from "react"

import useFullscreen from "@gs/hooks/useFullscreen"
import Accordion from "@gs/ui/Accordion"
import { FullscreenButton } from "@gs/ui/Button"
import Mdx from "@gs/ui/Mdx"

import { useEditorFormContext } from "./index"
import type { EditorFormInputProps } from "./types"

export default function EditorFormMarkdownInput({
  name,
  defaultValue = "",
  required,
}: EditorFormInputProps<string>) {
  const fullscreenProps = useFullscreen<HTMLDetailsElement>()
  const [value, setValue] = useState<string>(defaultValue)

  const itemId = useEditorFormContext().itemId

  return (
    <Accordion
      summary={fullscreenProps.isFullscreen ? `${itemId}'s ${name}` : name}
      open="always"
      summaryClassName="!m-0"
      summaryLeadingElement={<FullscreenButton {...fullscreenProps} />}
      accordionRef={fullscreenProps.targetRef}
      className="col-span-full"
    >
      <div
        className={clsx(
          "grid gap-2 rounded-sm border border-divider bg-default p-0 md:grid-cols-2",
          fullscreenProps.isFullscreen
            ? "h-[calc(100vh_-_2.5rem)]"
            : "h-[50vh]",
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
        <div className="prose prose-sm mx-auto hidden h-full w-full overflow-y-auto overflow-x-hidden rounded-sm bg-primary p-2 dark:prose-invert md:block">
          <Mdx mdx={value} lazyLoadImages={false} />
        </div>
      </div>
    </Accordion>
  )
}
