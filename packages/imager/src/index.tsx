import type { IncomingMessage } from "http"
import { createServer } from "https"
import { renderCanvas } from "recanvas"

import SocialImage from "./SocialImage"

const server = createServer(function (req, res) {
  const { params } = renderRequestLog(req, false)
  const width = 800
  const height = width * (9 / 16)

  const { title, url, caption, subtitle, imageUrl } = params
  if (!title) {
    res.statusCode = 400
    return res.end("Missing title")
  }

  const canvas = renderCanvas(
    <SocialImage
      {...{
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
      }}
    />,
    { width, height },
  )

  res.writeHead(200, {
    "Content-type": "image/png",
    width: canvas.width,
    height: canvas.height,
  })

  return res.end(canvas.toBuffer())
})

const port = Number(process.env.PORT || 443)

server.listen(port, () => console.log("Server is running at port:", port))

/** @param {http.IncomingMessage} req */
function renderRequestLog(req: IncomingMessage, showParams = true) {
  const { url: path = "", headers, method } = req
  const { searchParams, pathname } = new URL(path, `https://${headers.host}`)
  const params = Object.fromEntries(searchParams)
  const paramsList = Object.entries(params)
  const maxKeyLength = paramsList.reduce(
    (max, [key]) => Math.max(max, key.length),
    0,
  )

  console.log(`\n[${new Date().toLocaleString()}]`, method, pathname)
  if (showParams) {
    paramsList.forEach(([key, value], index) =>
      console.log(
        index === 0 ? "[Params]" : "\t",
        `${key.padEnd(maxKeyLength)}:`,
        `"${value}"`,
      ),
    )
  }

  return { params }
}
