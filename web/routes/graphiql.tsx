import { createGraphiQLFetcher } from "@graphiql/toolkit"
import GraphiQL from "graphiql"
import graphiqlStyles from "graphiql/graphiql.css"
import { useEffect, useState } from "react"

import type { LinkDescriptor } from "@remix-run/server-runtime"

export default function Page() {
  const [show, setShow] = useState(false)
  const defaultQuery = `{
    test
  }`

  useEffect(() => {
    setShow(true)
  }, [])

  if (!show) return null

  return (
    <section className="fixed inset-0 m-4 bg-primary pt-8">
      <GraphiQL
        fetcher={createGraphiQLFetcher({ url: "/graphql" })}
        defaultQuery={defaultQuery}
      />
    </section>
  )
}

export function links(): LinkDescriptor[] {
  return [{ rel: "stylesheet", href: graphiqlStyles }]
}
