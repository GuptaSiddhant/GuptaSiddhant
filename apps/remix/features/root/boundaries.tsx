import { useCatch } from "@remix-run/react"

import CodeBlock from "~/features/ui/CodeBlock"
import { ErrorPage } from "~/features/ui/Error"

import Document from "./Document"

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <Document error>
      <ErrorPage caption={error.name} message={error.message}>
        {error.stack && <CodeBlock>{error.stack}</CodeBlock>}
      </ErrorPage>
    </Document>
  )
}

export function CatchBoundary() {
  const caught = useCatch()

  let message
  switch (caught.status) {
    case 401:
      message =
        "Oops! Looks like you tried to visit a page that you do not have access to."
      break
    case 404:
      message =
        "Oops! Looks like you tried to visit a page that does not exist."
      break
    default:
      throw new Error(caught.data || caught.statusText)
  }

  const heading = `${caught.status}: ${caught.statusText}`

  return (
    <Document error>
      <ErrorPage
        caption={`Error ${caught.status}`}
        title={heading}
        message={message}
      />
    </Document>
  )
}