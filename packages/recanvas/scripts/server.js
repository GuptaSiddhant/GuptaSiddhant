import http from "http"
import { createElement } from "react"

import { renderCanvas } from "../dist/index.js"

getCanvas()

const server = http.createServer(function (req, res) {
  const { params } = renderRequestLog(req, false)
  res.writeHead(200, { "Content-type": "image/png" })
  res.end(getCanvas(params))
})

const port = process.env.PORT || 6001
// server.listen(port, () => console.log("Server is running at port:", port))

/** @param {http.IncomingMessage} req */
function renderRequestLog(req, showParams = true) {
  const { url: path, headers, method } = req
  const { searchParams, pathname } = new URL(path, `http://${headers.host}`)
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

/**
 * Edit canvas here
 * @param {{[k: string]: string}} params
 * */
function getCanvas(params) {
  const element = createElement(
    "canvas-root",
    {
      style: {
        backgroundColor: "green",
      },
    },
    createElement("canvas-view", {
      style: {
        width: 200,
        height: 300,
        backgroundColor: "blue",
      },
    }),
    createElement("canvas-text", {}, "Hello World"),
  )

  const x = renderCanvas(element, 500, 400)
  console.log(x)
  return x
}
