import useStableCallback from "@gs/hooks/useStableCallback"
import { useState } from "react"

import type { ToastProps } from "./Toast"

export default function useToasts() {
  const [toasts, setToasts] = useState<ToastProps[]>([])

  const clearToasts = useStableCallback(() => setToasts([]))

  const addToast = useStableCallback((toast: ToastProps) => {
    setToasts((ts) => addItemToArray(ts, toast))

    return toast.id
  })

  const removeToast = useStableCallback((toast: string | ToastProps) => {
    const id = typeof toast === "string" ? toast : toast.id
    setToasts((ts) => ts.filter((t) => t.id !== id))
  })

  const dismissToast = useStableCallback((toast?: string | ToastProps) => {
    if (!toast) return

    const id = typeof toast === "string" ? toast : toast.id
    setTimeout(() => removeToast(id), 150)
    setToasts((ts) =>
      ts.map((t) => (t.id === id ? { ...t, dismissed: true } : t)),
    )
  })

  const dismissAllToasts = useStableCallback(() =>
    toasts.map((t) => dismissToast(t.id)),
  )

  return {
    toasts,
    addToast,
    dismissToast,
    clearToasts,
    removeToast,
    dismissAllToasts,
  }
}

// Helpers
function addItemToArray<T extends { id: string }>(
  array: T[],
  item: T,
  insertAtStart: boolean = false,
): T[] {
  const existingToastIndex = array.findIndex((t) => t.id === item.id)
  if (existingToastIndex === -1)
    return insertAtStart ? [item, ...array] : [...array, item]

  return [
    ...array.slice(0, existingToastIndex),
    item,
    ...array.slice(existingToastIndex + 1),
  ]
}
