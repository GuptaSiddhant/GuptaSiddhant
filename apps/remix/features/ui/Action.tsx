import { type FormProps, useFetcher, useLocation } from "@remix-run/react"
import clsx from "clsx"

import useStableCallback from "~/features/hooks/useStableCallback"
import { type ToastProps } from "~/features/toaster/Toast"

import useToastWithMinDuration from "../toaster/useToastWithMinDuration"
import Button from "./Button"
import Popover from "./Popover"
import PopoverConfirmContent, {
  type PopoverConfirmProps,
} from "./Popover/Confirm"

export interface ActionProps extends FormProps {
  children: React.ReactNode
  title: string
  body?: Record<string, any>
  confirm?: Partial<PopoverConfirmProps> | string
  toast?: string | Omit<ToastProps, "id">
}

export default function Action({
  children,
  confirm,
  body = {},
  title,
  className,
  method = "post",
  toast,
  action,
  encType,
  replace = true,
}: ActionProps): JSX.Element | null {
  const { submit, isSubmitting, origin } = useActionFetcher(toast)

  const handleSubmit = useStableCallback(() =>
    submit({ ...body, origin }, { replace, method, action, encType }),
  )

  if (confirm) {
    return (
      <Popover
        title={title}
        content={
          <PopoverConfirmContent
            {...(typeof confirm === "string" ? { children: confirm } : confirm)}
            onConfirm={handleSubmit}
          />
        }
      >
        <div className={clsx(className, "gap-2 flex-center")}>{children}</div>
      </Popover>
    )
  }

  return (
    <Button
      title={title}
      type="button"
      className={clsx(className, "gap-2 flex-center")}
      onClick={handleSubmit}
      disabled={isSubmitting}
    >
      {children}
    </Button>
  )
}

function useActionFetcher(toastProps?: string | Omit<ToastProps, "id">) {
  const { pathname, search, hash } = useLocation()
  const origin = `${pathname}${search}${hash}`

  const { submit, submission, state } = useFetcher()
  const id = submission?.key
  const isSubmitting = state === "submitting"

  useToastWithMinDuration(
    {
      id: id!,
      persistent: true,
      variant: "info",
      ...(typeof toastProps === "string"
        ? { title: toastProps! }
        : toastProps!),
    },
    Boolean(isSubmitting && toastProps),
  )

  return { submit, isSubmitting, origin }
}
