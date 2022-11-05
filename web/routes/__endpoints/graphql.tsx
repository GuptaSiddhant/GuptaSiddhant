import { buildSchema, graphql } from "graphql"

import type { LoaderArgs } from "@remix-run/server-runtime"

import * as resolvers from "@gs/graphql/resolvers"
import schemaFile from "@gs/graphql/schema.graphql"

export async function action({ request }: LoaderArgs) {
  const schema = buildSchema(schemaFile)
  const { query, variables, operationName } = await request.json()

  return graphql({
    schema,
    source: query,
    variableValues: variables,
    rootValue: resolvers,
    operationName,
  })
}

export async function loader() {
  return new Response(
    "This endpoint for graphql server. It should be accessed with POST method. For GraphIQl, visit '/graphiql'.",
    { status: 400 },
  )
}
