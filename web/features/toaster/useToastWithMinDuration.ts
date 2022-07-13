import { useEffect, useRef } from "react"

import useToaster, { type ToastProps } from "."

const MIN_TOAST_DURATION = 1_000 // ms

export default function useToastWithMinDuration(
  toastProps: ToastProps,
  isVisible?: boolean,
  options?: {
    minDuration?: number
    onShow?: () => void
    onHide?: () => void
  },
) {
  const { addToast, dismissToast } = useToaster()
  const { minDuration = MIN_TOAST_DURATION, onHide, onShow } = options || {}

  const idRef = useRef<string | undefined>(undefined)
  const startTimeRef = useRef<number>(0)

  useEffect(() => {
    if (isVisible) {
      idRef.current = toastProps.id
      startTimeRef.current = Date.now()
      addToast(toastProps)
      onShow?.()
    }
  }, [isVisible, addToast, toastProps, onShow])

  useEffect(() => {
    if (isVisible || !idRef.current) return

    const durationSpent = Date.now() - startTimeRef.current

    if (durationSpent > minDuration) {
      dismissToast(idRef.current)
      onHide?.()
    } else {
      setTimeout(() => {
        dismissToast(idRef.current)
        onHide?.()
      }, minDuration - durationSpent)
    }
  }, [isVisible, dismissToast, onHide, minDuration])
}
