import type { Express, Request, Response } from "express"
import { renderCanvas } from "recanvas"

import SocialImage from "./SocialImage"

const app: Express = require("express")()

app.get("/", renderImageFromRequest)

export default app

function renderImageFromRequest(req: Request, res: Response) {
  const params = req.query
  const width = 800
  const height = width * (9 / 16)

  const {
    title = "www.guptasiddhant.com",
    url,
    caption,
    subtitle,
    imageUrl,
  } = params
  if (!title) {
    res.statusCode = 400
    return res.end("Missing title")
  }

  const canvas = renderCanvas(
    <SocialImage
      {...({
        width,
        height,
        title,
        url,
        caption,
        subtitle,
        imageUrl,
        textColor: "#fff",
        backgroundColor: "#171717",
        borderColor: "#000",
      } as any)}
    />,
    { width, height },
  )

  res.writeHead(200, {
    "Content-type": "image/png",
    width: canvas.width,
    height: canvas.height,
  })

  return res.end(canvas.toBuffer())
}

// function renderRequestLog(req: Request, showParams = true) {
//   const { url: path = "", headers, method } = req
//   const { searchParams, pathname } = new URL(path, `https://${headers.host}`)
//   const params = Object.fromEntries(searchParams)
//   const paramsList = Object.entries(params)
//   const maxKeyLength = paramsList.reduce(
//     (max, [key]) => Math.max(max, key.length),
//     0,
//   )

//   console.log(`\n[${new Date().toLocaleString()}]`, method, pathname)
//   if (showParams) {
//     paramsList.forEach(([key, value], index) =>
//       console.log(
//         index === 0 ? "[Params]" : "\t",
//         `${key.padEnd(maxKeyLength)}:`,
//         `"${value}"`,
//       ),
//     )
//   }

//   return { params }
// }
