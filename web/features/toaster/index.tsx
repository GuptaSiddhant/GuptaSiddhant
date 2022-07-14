import clsx from "clsx"
import { type ReactNode, createContext, useContext } from "react"
import ClearIcon from "remixicon-react/CloseCircleLineIcon"
import invariant from "tiny-invariant"

import type { ToastProps } from "./Toast"
import Toast from "./Toast"
import useToasts from "./useToasts"

export interface ToasterContextValue {
  addToast: (toast: ToastProps) => string
  dismissToast: (toast?: string | ToastProps) => void
}

const ToasterContext = createContext<ToasterContextValue | undefined>(undefined)

export default function useToaster(): ToasterContextValue {
  const context = useContext(ToasterContext)
  invariant(context, "useToast must be used within a Toaster.")

  return context
}

export function Toaster({
  children,
}: {
  children: ReactNode
}): JSX.Element | null {
  const { toasts, addToast, dismissToast, dismissAllToasts } = useToasts()

  return (
    <ToasterContext.Provider value={{ addToast, dismissToast }}>
      {children}

      <div
        id="toaster"
        className={clsx(
          "fixed bottom-2 right-2 z-toast flex w-max flex-col gap-2",
          "w-[calc(100vw_-_4rem)] xs:w-80",
        )}
      >
        {toasts.map((toast) => (
          <Toast key={toast.id} {...toast} />
        ))}

        {toasts.length > 1 ? (
          <button
            type="button"
            onClick={dismissAllToasts}
            title="Dismiss all toasts"
            className="absolute bottom-0 -left-12 aspect-square w-10 animate-appear-btt rounded bg-secondary flex-center hocus:bg-tertiary"
          >
            <ClearIcon />
            <span className="sr-only">Dismiss all toasts</span>
          </button>
        ) : null}
      </div>
    </ToasterContext.Provider>
  )
}

export { ToastProps }
