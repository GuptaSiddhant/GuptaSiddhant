import { buildSchema, graphql } from "graphql"

import { type LoaderArgs, redirect } from "@remix-run/server-runtime"

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
    contextValue: { request },
  })
}

export async function loader() {
  return redirect("/graphiql")
}
