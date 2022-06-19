import clsx from "clsx"
import { type ReactNode, useState } from "react"

import useAnimationFrame from "~/features/hooks/useAnimationFrame"
import useTimeout from "~/features/hooks/useTimeout"

import useToaster from "."

export interface ToastProps {
  id: string
  title: string
  icon: ReactNode
  dismissed?: boolean
  durationInMs?: number
  persistent?: boolean
}

export default function Toast({
  id,
  icon,
  title,
  dismissed,
  durationInMs = 5000,
  persistent = false,
}: ToastProps): JSX.Element {
  const { dismissToast } = useToaster()
  const [isHovering, setIsHovering] = useState(false)
  const isPaused = persistent || isHovering

  useTimeout(() => dismissToast(id), durationInMs, isPaused)

  return (
    <div
      className={clsx(
        "relative overflow-hidden",
        "bg-secondary p-4 rounded w-full shadow-xl",
        dismissed ? "animate-disappear-ltr" : "animate-appear-rtl",
        "flex flex-wrap gap-4",
      )}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {icon}
      {title}

      {!persistent ? (
        <Progress durationInMs={durationInMs} isPaused={isPaused} />
      ) : null}
    </div>
  )
}

function Progress({
  durationInMs,
  isPaused = false,
}: {
  durationInMs: number
  isPaused?: boolean
}): JSX.Element {
  const [progress, setProgress] = useState(durationInMs)

  useAnimationFrame(({ delta }) => {
    if (!isPaused) setProgress((p) => p - delta)
  })

  const percent = (progress / durationInMs) * 100

  return (
    <div className="absolute bottom-0 left-0 right-0 h-1">
      <div className="bg-green-500 h-full" style={{ width: percent + "%" }} />
    </div>
  )
}
