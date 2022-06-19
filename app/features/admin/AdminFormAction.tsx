import { type FormMethod, useLocation } from "@remix-run/react"
import { Form } from "@remix-run/react"

export interface AdminFormActionProps {
  children: JSX.Element
  title: string
  body?: Record<string, any>
  method: FormMethod
}

export default function AdminFormAction({
  children,
  title,
  body = {},
  method,
}: AdminFormActionProps): JSX.Element | null {
  const { pathname } = useLocation()

  return (
    <Form method={method} replace className="flex-center" action={pathname}>
      {Object.entries(body).map(([key, value]) => (
        <input key={key} name={key} value={value} type={"hidden"} />
      ))}
      <button title={title}>
        {children}
        <span className="sr-only">{title}</span>
      </button>
    </Form>
  )
}
