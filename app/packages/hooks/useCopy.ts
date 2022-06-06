import { __IS_SERVER__ } from "~/packages/constants"
import { useCallback, useEffect, useState } from "react"

export default function useCopy(data: string, timeoutInMs = 3000) {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (copied) {
      const timeout = setTimeout(() => setCopied(false), timeoutInMs)
      return () => clearTimeout(timeout)
    }
  }, [copied, timeoutInMs])

  const handleCopy = useCallback(() => {
    if (data) {
      window.navigator?.clipboard?.writeText(data).then(() => setCopied(true))
    }
  }, [data, setCopied])

  const isAvailable = __IS_SERVER__
    ? true
    : Boolean(window.navigator?.clipboard && window.isSecureContext)

  return [copied, handleCopy, isAvailable] as const
}
