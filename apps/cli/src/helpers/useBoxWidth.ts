import { type DOMElement, measureElement } from "ink"
import { useEffect, useRef, useState } from "react"

export default function useBoxWidth() {
  const ref = useRef<DOMElement>(null)
  const [width, setWidth] = useState(0)

  useEffect(() => {
    if (ref.current) {
      const { width } = measureElement(ref.current)
      setWidth(width)
    }
  }, [ref])

  return { ref, width }
}
