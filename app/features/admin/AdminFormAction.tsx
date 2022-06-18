import { Form } from "@remix-run/react"

export interface AdminFormActionProps {
  children: JSX.Element
  title: string
  body?: Record<string, string>
}

export default function AdminFormAction({
  children,
  title,
  body = {},
}: AdminFormActionProps): JSX.Element | null {
  return (
    <Form method="put" replace className="flex-center">
      {Object.entries(body).map(([key, value]) => (
        <input key={key} name={key} value={value} type={"hidden"} />
      ))}
      <button>
        {children}
        <span className="sr-only">{title}</span>
      </button>
    </Form>
  )
}
