import { buildSchema, graphql } from "graphql"

import type { LoaderArgs } from "@remix-run/server-runtime"

import * as resolvers from "@gs/graphql/resolvers"
import schemaFile from "@gs/graphql/schema.graphql"

export async function action({ request }: LoaderArgs) {
  const schema = buildSchema(schemaFile)
  const { query, variables } = await request.json()

  return graphql({
    schema,
    source: query,
    variableValues: variables,
    rootValue: resolvers,
  })
}
