import Accordion from "@gs/ui/Accordion"
import clsx from "clsx"
import { useEffect, useRef, useState } from "react"
import FullscreenExitIcon from "remixicon-react/FullscreenExitLineIcon"
import FullscreenEnterIcon from "remixicon-react/FullscreenLineIcon"

import Mdx from "~/features/ui/Mdx"

import { useEditorFormContext } from "./index"
import type { EditorFormInputProps } from "./types"

export default function EditorFormMarkdownInput({
  name,
  defaultValue = "",
  required,
}: EditorFormInputProps<string>) {
  const ref = useRef<HTMLDetailsElement>(null)
  const [isFullscreen, setIsFullscreen] = useState<boolean | null>(null)
  const [value, setValue] = useState<string>(defaultValue)

  useEffect(() => {
    if (window.document.fullscreenEnabled) {
      setIsFullscreen((enabled) => enabled === true)
    }
  }, [])

  const handleClick = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen()
      setIsFullscreen(false)
    } else {
      ref.current?.requestFullscreen()
      setIsFullscreen(true)
    }
  }

  const itemId = useEditorFormContext().itemId

  return (
    <Accordion
      summary={isFullscreen ? `${itemId}'s ${name}` : name}
      open
      summaryClassName="!m-0"
      summaryLeadingElement={
        isFullscreen !== null ? (
          <button
            onClick={handleClick}
            title={isFullscreen ? "Exit fullscreen" : "Go fullscreen"}
          >
            {isFullscreen ? <FullscreenExitIcon /> : <FullscreenEnterIcon />}
          </button>
        ) : null
      }
      accordionRef={ref}
    >
      <div
        className={clsx(
          "grid grid-cols-2 gap-2 bg-default p-0",
          isFullscreen ? "h-[calc(100vh_-_2.5rem)]" : "h-[50vh]",
        )}
      >
        <textarea
          name={name}
          defaultValue={defaultValue}
          onChange={(e) => setValue(e.target.value)}
          required={required}
          className={clsx(
            "h-full w-full resize-none overflow-auto rounded bg-secondary p-2 font-monospace text-sm",
          )}
        />
        <div className="prose prose-sm mx-auto h-full overflow-y-auto overflow-x-hidden rounded-sm bg-primary p-2 dark:prose-invert">
          <Mdx mdx={value} lazyLoadImages={false} />
        </div>
      </div>
    </Accordion>
  )
}
