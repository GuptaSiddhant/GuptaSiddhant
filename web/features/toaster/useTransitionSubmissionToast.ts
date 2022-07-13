import useToaster from "@gs/toaster"
import { useTransition } from "@remix-run/react"
import { useEffect, useMemo } from "react"

import { type ToastProps } from "./Toast"

export type SubmissionMethodType = "PUT" | "POST" | "DELETE" | "PATCH" | "GET"
export type TransitionSubmissionToastTitles = Record<
  SubmissionMethodType,
  undefined | string | Omit<ToastProps, "id">
>

export default function useTransitionSubmissionToast(
  titles: Partial<TransitionSubmissionToastTitles>,
) {
  const { addToast, dismissToast } = useToaster()
  const { submission } = useTransition()
  const id = "submission"
  const method = submission?.method
  const toast = method ? titles[method] : undefined

  const newToast: ToastProps | undefined = useMemo(() => {
    if (typeof toast === "object") return { id, persistent: true, ...toast }
    const title = toast
    if (title) return { id, title, persistent: true }
    return undefined
  }, [toast])

  useEffect(() => {
    if (!method) return dismissToast(id)
    if (newToast) addToast(newToast)
  }, [method, newToast, addToast, dismissToast])
}
