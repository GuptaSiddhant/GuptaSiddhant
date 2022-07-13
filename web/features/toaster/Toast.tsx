import clsx from "clsx"
import {
  type ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react"
import CloseIcon from "remixicon-react/CloseCircleLineIcon"
import invariant from "tiny-invariant"

import useAnimationFrame from "@gs/hooks/useAnimationFrame"

import useToaster from "."

const ToastContext = createContext<ToastProps | undefined>(undefined)

export interface ToastProps {
  id: string
  title: string
  icon?: ReactNode
  dismissed?: boolean
  durationInMs?: number
  persistent?: boolean
  className?: string
  children?: ReactNode
  variant?: ToastVariant
}

type ToastVariant = "success" | "error" | "info"

export default function Toast(toast: ToastProps): JSX.Element {
  const {
    id,
    icon,
    title,
    dismissed,
    persistent = false,
    className,
    children,
    variant,
  } = toast
  const [isHovering, setIsHovering] = useState(false)

  return (
    <ToastContext.Provider value={toast}>
      <div
        id={"toast-" + id}
        className={clsx(
          className,
          "relative w-full overflow-hidden rounded border bg-secondary shadow-xl",
          dismissed ? "animate-disappear-ltr" : "animate-appear-rtl",
          getClassNameForToastVariant(variant),
        )}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {children ?? (
          <div className={clsx("flex items-start gap-2 p-3")}>
            {icon}
            <span className="flex-1 text-base">{title}</span>
            <DismissToastButton />
          </div>
        )}

        {!persistent ? <Progress isPaused={isHovering} /> : null}
      </div>
    </ToastContext.Provider>
  )
}

Toast.DismissButton = DismissToastButton

// Helpers

function useToast(): ToastProps {
  const context = useContext(ToastContext)
  invariant(context, "Toast must be wrapped in a ToastProvider")

  return context
}

function getClassNameForToastVariant(
  variant?: ToastVariant,
  bg?: boolean,
): string {
  switch (variant) {
    case "success":
      return bg ? "bg-green-500" : "border-green-500"
    case "error":
      return bg ? "bg-red-500" : "border-red-500"
    case "info":
      return bg ? "bg-blue-500" : "border-blue-500"
    default:
      return clsx(bg ? "bg-gray-500" : "border-gray-500")
  }
}

// Components

function DismissToastButton({
  children,
}: {
  children?: ReactNode
}): JSX.Element {
  const { dismissToast } = useToaster()
  const { id } = useToast()

  return (
    <button onClick={() => dismissToast(id)}>
      {children || <CloseIcon className="fill-red-300" />}
      <span className="sr-only">Dismiss toast</span>
    </button>
  )
}

function Progress({ isPaused = false }: { isPaused?: boolean }): JSX.Element {
  const { dismissToast } = useToaster()
  const { id, variant, durationInMs = 5000 } = useToast()
  const [remainingTimeInMs, setRemainingTimeInMs] = useState(durationInMs)

  useAnimationFrame(({ delta }) => {
    if (!isPaused) setRemainingTimeInMs((p) => p - delta)
  })

  useEffect(() => {
    if (remainingTimeInMs <= 0) dismissToast(id)
  }, [remainingTimeInMs, id, dismissToast])

  return (
    <div className="absolute bottom-0 left-0 right-0 h-1">
      <div
        className={getClassNameForToastVariant(variant, true)}
        style={{
          height: "100%",
          width: (remainingTimeInMs / durationInMs) * 100 + "%",
        }}
      />
    </div>
  )
}
