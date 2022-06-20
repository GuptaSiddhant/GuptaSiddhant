import { type FormMethod, useLocation } from "@remix-run/react"
import { type FormProps, Form } from "@remix-run/react"
import clsx from "clsx"
import type { ReactNode } from "react"

export interface AdminFormActionProps extends FormProps {
  children: ReactNode
  title: string
  body?: Record<string, any>
  method: FormMethod
}

export default function AdminFormAction({
  children,
  title,
  body = {},
  method,
  className,
  ...props
}: AdminFormActionProps): JSX.Element | null {
  const { pathname } = useLocation()

  return (
    <Form
      {...props}
      method={method}
      replace
      className="flex-center"
      action={pathname}
    >
      {Object.entries(body).map(([key, value]) => (
        <input key={key} name={key} value={value} type={"hidden"} />
      ))}
      <button title={title} className={clsx(className, "flex-center gap-2")}>
        {children}
      </button>
    </Form>
  )
}
