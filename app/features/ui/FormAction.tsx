import { type FormMethod, useLocation } from "@remix-run/react"
import { type FormProps, Form } from "@remix-run/react"
import clsx from "clsx"
import type { ReactNode } from "react"

export interface FormActionProps extends FormProps {
  children: ReactNode
  title: string
  body?: Record<string, any>
  method: FormMethod
}

export default function FormAction({
  children,
  title,
  body = {},
  className,
  ...props
}: FormActionProps): JSX.Element | null {
  const { pathname, search, hash } = useLocation()
  const origin = `${pathname}${search}${hash}`

  return (
    <Form action={pathname} {...props} replace className="flex-center">
      {Object.entries(body).map(([key, value]) => (
        <input key={key} name={key} value={value} type={"hidden"} />
      ))}
      <input type="hidden" name="origin" value={origin} />
      <button title={title} className={clsx(className, "flex-center gap-2")}>
        {children}
      </button>
    </Form>
  )
}
