import clsx from "clsx";

import {
  Form,
  type FormEncType,
  type FormProps,
  useFetcher,
  useLocation,
  useSubmit,
} from "@remix-run/react";

import useStableCallback from "@gs/hooks/useStableCallback";
import { type ToastProps } from "@gs/toaster/Toast";

import useToastWithMinDuration from "../toaster/useToastWithMinDuration";
import Button from "./Button";
import Popover from "./Popover";
import PopoverConfirmContent, {
  type PopoverConfirmProps,
} from "./Popover/Confirm";

export interface ActionProps extends FormProps {
  children: React.ReactNode;
  title: string;
  body?: Record<string, unknown>;
  confirm?: Partial<PopoverConfirmProps> | string;
  toast?: string | Omit<ToastProps, "id">;
  disabled?: boolean;
}

export default function Action({
  children,
  confirm,
  body = {},
  title,
  className,
  method = "POST",
  toast: toastProps,
  action,
  encType,
  replace = true,
  id,
  disabled,
}: ActionProps): JSX.Element | null {
  const originPath = useOriginPath();
  const { submit, state } = useFetcher();
  const isSubmitting = state === "submitting";

  useToastWithMinDuration(
    {
      id: state,
      persistent: true,
      variant: "info",
      ...(typeof toastProps === "string"
        ? { title: toastProps! }
        : toastProps!),
    },
    Boolean(isSubmitting && toastProps),
  );

  const handleSubmit = useStableCallback(() =>
    submit(
      { ...body, originPath },
      { replace, method, action, encType: encType as FormEncType | undefined },
    ),
  );

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
    );
  }

  return (
    <Button
      id={id}
      title={title}
      type="button"
      className={clsx(className, "gap-2 flex-center")}
      onClick={handleSubmit}
      disabled={disabled || isSubmitting}
    >
      {children}
    </Button>
  );
}

Action.Form = FormAction;

function FormAction({
  body = {},
  title,
  className,
  children,
  confirm,
  method = "GET",
  encType,
  ...props
}: Omit<ActionProps, "toast" | "method"> & {
  method: "GET" | "POST";
}): JSX.Element | null {
  const originPath = useOriginPath();
  const submit = useSubmit();

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
    );
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
                encType: encType as FormEncType | undefined,
                ...props,
              },
            );
          }}
        />
      }
    >
      <div title={title} className={clsx(className, "gap-2 flex-center")}>
        {children}
      </div>
    </Popover>
  );
}

function useOriginPath() {
  const { pathname, search, hash } = useLocation();

  return `${pathname}${search}${hash}`;
}
