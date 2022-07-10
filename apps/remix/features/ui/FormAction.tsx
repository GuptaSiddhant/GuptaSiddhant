import {
  type FetcherWithComponents,
  type FormMethod,
  useLocation,
  useSubmit,
} from "@remix-run/react"
import { type FormProps, Form } from "@remix-run/react"
import clsx from "clsx"
import { useRef } from "react"

import Popover from "./Popover"
import PopoverConfirmContent, {
  type PopoverConfirmProps,
} from "./Popover/Confirm"

export interface FormActionProps extends FormProps {
  children: React.ReactNode
  title: string
  body?: Record<string, any>
  method?: FormMethod
  confirm?: Partial<PopoverConfirmProps> | string
  fetcher?: FetcherWithComponents<any>
}

export default function FormAction(props: FormActionProps): JSX.Element | null {
  if (props.confirm) {
    return <ActionWithConfirm {...props} />
  }

  return <Action {...props} />
}

function ActionWithConfirm({
  confirm = "Are yous sure?",
  title,
  children,
  className,
  body = {},
  ...props
}: FormActionProps) {
  const submit = useSubmit()
  const formRef = useRef<HTMLFormElement>(null)
  const origin = useOrigin()

  return (
    <>
      <Popover
        title={title}
        content={
          <PopoverConfirmContent
            {...(typeof confirm === "string" ? { children: confirm } : confirm)}
            onConfirm={() => {
              console.log(formRef.current)
              submit(formRef.current)
            }}
          />
        }
      >
        <div title={title} className={clsx(className, "gap-2 flex-center")}>
          {children}
        </div>
      </Popover>
      <Form hidden {...props} replace ref={formRef}>
        {Object.entries({ ...body, origin }).map(([key, value]) => (
          <input key={key} name={key} value={value} type={"hidden"} />
        ))}
      </Form>
    </>
  )
}

function Action({
  children,
  body = {},
  title,
  className,
  formRef,
  hidden = false,
  method = "post",
  ...props
}: FormActionProps & { formRef?: React.Ref<HTMLFormElement> }) {
  const origin = useOrigin()

  return (
    <Form
      {...props}
      replace
      className={clsx("flex-center")}
      ref={formRef}
      hidden={hidden}
      method={method}
    >
      {Object.entries({ ...body, origin }).map(([key, value]) => (
        <input key={key} name={key} value={value} type={"hidden"} />
      ))}
      <button title={title} className={clsx(className, "gap-2 flex-center")}>
        {children}
      </button>
    </Form>
  )
}

function useOrigin() {
  const { pathname, search, hash } = useLocation()

  return `${pathname}${search}${hash}`
}
