import clsx from "clsx"
import { CopyButton } from "./Button"

export default function CommandShell({
  command,
  comment,
  language = "shell",
}: {
  command: string
  comment?: string
  language?: string
}): JSX.Element | null {
  return (
    <pre className="-mx-4 whitespace-pre-line rounded-lg bg-default p-4 text-base relative">
      <div
        className={clsx(
          "absolute -top-2 right-4 select-none",
          "bg-tertiary rounded-sm px-1 text-sm text-tertiary",
          "flex gap-1",
        )}
      >
        <CopyButton className="text-sm font-monospace border-r-[1px] border-gray-400 pr-1">
          {command}
        </CopyButton>

        <code>{language}</code>
      </div>
      {comment ? (
        <code
          className={clsx(
            "block select-none text-sm text-disabled",
            "before:content-['#'] before:mr-2",
          )}
        >
          {comment}
        </code>
      ) : null}
      <code
        className={clsx(
          "text-primary",
          "before:content-['$'] before:select-none before:text-disabled before:mr-2",
        )}
      >
        <span>{command}</span>
      </code>
    </pre>
  )
}
