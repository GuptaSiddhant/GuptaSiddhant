import { type FormMethod, useLocation, useSubmit } from "@remix-run/react"
import { type FormProps, Form } from "@remix-run/react"
import clsx from "clsx"
import type { ReactNode } from "react"

import Popover, { type PopoverConfirmProps } from "./Popover"

export interface FormActionProps extends FormProps {
  children: ReactNode
  title: string
  body?: Record<string, any>
  method: FormMethod
  confirm?: Partial<PopoverConfirmProps> | string
}

export default function FormAction({
  children,
  title,
  body = {},
  className,
  confirm,
  ...props
}: FormActionProps): JSX.Element | null {
  const submit = useSubmit()
  const { pathname, search, hash } = useLocation()
  const origin = `${pathname}${search}${hash}`

  if (confirm) {
    return (
      <Popover
        content={
          <Popover.Confirm
            {...(typeof confirm === "string" ? { children: confirm } : confirm)}
            onConfirm={() => {
              submit(
                { ...body, origin },
                {
                  action: pathname,
                  encType: "application/x-www-form-urlencoded",
                  ...props,
                  replace: true,
                },
              )
            }}
          />
        }
        className={clsx("form-action", className)}
      >
        <div title={title} className={clsx(className, "gap-2 flex-center")}>
          {children}
        </div>
      </Popover>
    )
  }

  return (
    <Form action={pathname} {...props} replace className="flex-center">
      {Object.entries(body).map(([key, value]) => (
        <input key={key} name={key} value={value} type={"hidden"} />
      ))}
      <input type="hidden" name="origin" value={origin} />
      <button title={title} className={clsx(className, "gap-2 flex-center")}>
        {children}
      </button>
    </Form>
  )
}
