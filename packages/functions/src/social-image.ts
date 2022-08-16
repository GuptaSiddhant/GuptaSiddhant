import * as functions from "firebase-functions"
import { createElement } from "react"
import { View, Text, renderCanvas } from "recanvas"

export const socialImage = functions
  .region("europe-west1")
  .https.onRequest(createSocialImage)

async function createSocialImage(
  req: functions.https.Request,
  res: functions.Response,
) {
  const canvas = getCanvas(req.query)
  const buffer = canvas.toBuffer()

  res.writeHead(200, {
    "Content-type": "image/png",
    "Content-Length": Buffer.byteLength(buffer),
    width: canvas.width,
    height: canvas.height,
  })
  res.end(buffer)
}

/**
 * Edit canvas here
 * @param {{[k: string]: string}} params
 * */
function getCanvas(params: any) {
  const width = 800
  const height = width / (16 / 9)

  const element = createElement(
    View,
    {
      style: {
        flexDirection: "column",
        // backgroundColor: "green",
        justifyContent: "space-around",
        paddingTop: 20,
        paddingLeft: 20,
        paddingRight: 20,
        paddingBottom: 20,
      },
    },
    createElement(
      View,
      {
        style: {
          paddingTop: 20,
          paddingLeft: 20,
          paddingRight: 20,
          paddingBottom: 20,
          alignItems: "center",
          justifyContent: "center",
          ...({ backgroundColor: "blue" } as any),
        },
      },
      createElement(
        Text,
        {
          style: {
            backgroundColor: "grey",
            flexGrow: 0,
            ...({ color: "white" } as any),
          },
        },
        "Hello World",
      ),
    ),
    createElement(
      View,
      {
        style: {
          paddingTop: 20,
          paddingLeft: 20,
          paddingRight: 20,
          paddingBottom: 20,
          flexDirection: "column",
          ...({ backgroundColor: "red" } as any),
        },
      },
      createElement(
        Text,
        {
          style: { backgroundColor: "grey", color: "white" } as any,
          font: { size: 32 },
        },

        "Hello World from the land of Canvas. It is a beautiful day today.",
      ),
    ),
  )

  return renderCanvas(element, { width, height })
}
