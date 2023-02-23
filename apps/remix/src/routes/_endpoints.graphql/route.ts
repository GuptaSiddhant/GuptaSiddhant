import { type LoaderArgs, redirect } from "@remix-run/server-runtime";
import { buildSchema, graphql } from "graphql";
import { z } from "zod";

import * as resolvers from "./resolvers.server";
import schemaFile from "./schema.graphql";

export async function action({ request }: LoaderArgs) {
  const schema = buildSchema(schemaFile);
  const { query, variables, operationName } = z
    .object({
      query: z.string(),
      variables: z.record(z.string(), z.any()).optional(),
      operationName: z.string().optional(),
    })
    .parse(await request.json());

  return graphql({
    schema,
    source: query,
    variableValues: variables,
    rootValue: resolvers,
    operationName,
    contextValue: { request },
  });
}

export async function loader() {
  return redirect("/graphiql");
}
