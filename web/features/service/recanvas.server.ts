import { createElement, Fragment } from "react"
import { renderCanvas } from "recanvas"

export default function recanvasRequest(
  element: React.ReactNode,
  width = 800,
  height = 450,
) {
  const canvas = renderCanvas(
    createElement(Fragment, null, element),
    {
      width,
      height,
    },
    {},
  )

  return new Response(canvas.toBuffer(), {
    status: 200,
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "s-maxage=31536000, stale-while-revalidate",
    },
  })
}
