import { useEffect, useRef } from "react"

import { useTransition } from "@remix-run/react"

import useToaster from "."

export default function useTransitionStateToast(
  loadingTitle: string = "Loading...",
  submittingTitle: string = loadingTitle,
) {
  const { state } = useTransition()
  const { addToast, dismissToast } = useToaster()
  const idRef = useRef<string>()
  const title: string = state === "submitting" ? submittingTitle : loadingTitle

  useEffect(() => {
    if (state === "idle") return dismissToast(idRef.current)

    idRef.current = addToast({
      id: "state",
      persistent: true,
      title,
    })
  }, [state, title, addToast, dismissToast])
}
