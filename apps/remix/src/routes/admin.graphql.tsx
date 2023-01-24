import { createGraphiQLFetcher } from "@graphiql/toolkit";
import GraphiQL from "graphiql";
import { useEffect, useState } from "react";

import type { LinkDescriptor } from "@remix-run/server-runtime";

import graphiqlStyles from "@gs/styles/graphiql.css";

export default function GraphQL() {
  const [show, setShow] = useState(false);
  useEffect(() => setShow(true), []);

  if (!show) {
    return null;
  }

  const defaultQuery = `query Projects($limit: Int) {
  projects(limit: $limit) {
    title
  }
}`;

  const variables = `{
  "limit": 5
}`;

  return (
    <GraphiQL
      fetcher={createGraphiQLFetcher({ url: "/graphql" })}
      defaultQuery={defaultQuery}
      variables={variables}
    />
  );
}

export function links(): LinkDescriptor[] {
  return [{ rel: "stylesheet", href: graphiqlStyles }];
}
