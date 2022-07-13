import {
  type FormProps,
  Form,
  useFetcher,
  useLocation,
  useSubmit,
} from "@remix-run/react"
import clsx from "clsx"

import useStableCallback from "@gs/hooks/useStableCallback"
import { type ToastProps } from "@gs/toaster/Toast"

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
  toast: toastProps,
  action,
  encType,
  replace = true,
  id,
}: ActionProps): JSX.Element | null {
  const originPath = useOriginPath()

  const { submit, submission, state } = useFetcher()
  const key = submission?.key
  const isSubmitting = state === "submitting"

  useToastWithMinDuration(
    {
      id: key!,
      persistent: true,
      variant: "info",
      ...(typeof toastProps === "string"
        ? { title: toastProps! }
        : toastProps!),
    },
    Boolean(isSubmitting && toastProps),
  )

  const handleSubmit = useStableCallback(() =>
    submit({ ...body, originPath }, { replace, method, action, encType }),
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
      id={id}
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

Action.Form = FormAction

function FormAction({
  body = {},
  title,
  className,
  children,
  confirm,
  method = "get",
  ...props
}: Omit<ActionProps, "toast">): JSX.Element | null {
  const originPath = useOriginPath()
  const submit = useSubmit()

  if (!confirm) {
    return (
      <Form {...props} method={method} replace className={clsx("flex-center")}>
        {Object.entries({ ...body, originPath }).map(([key, value]) => (
          <input key={key} name={key} value={value} type={"hidden"} />
        ))}
        <button title={title} className={clsx(className, "gap-2 flex-center")}>
          {children}
        </button>
      </Form>
    )
  }

  return (
    <Popover
      title={title}
      content={
        <PopoverConfirmContent
          {...(typeof confirm === "string" ? { children: confirm } : confirm)}
          onConfirm={() => {
            submit(
              { ...body, originPath },
              {
                method,
                replace: true,
                ...props,
              },
            )
          }}
        />
      }
    >
      <div title={title} className={clsx(className, "gap-2 flex-center")}>
        {children}
      </div>
    </Popover>
  )
}

function useOriginPath() {
  const { pathname, search, hash } = useLocation()

  return `${pathname}${search}${hash}`
}
