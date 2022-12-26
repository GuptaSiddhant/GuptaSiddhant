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

  const defaultQuery = `query ($limit: Int) {
  about {
    name
  }
  projects(limit: $limit) {
    ...Item
  }
  blog(limit: $limit) {
    ...Item
  }
  education(limit: $limit) {
    ...Item
  }
  career(limit: $limit) {
    ...Item
  }
}

fragment Item on SummaryItem {
  title
  subtitle
  description
  date
}`;

  const variables = `{
  "limit": 5
}`;

  return (
    <div id="graphiql" className="fixed top-10 z-0 inset-4">
      <GraphiQL
        fetcher={createGraphiQLFetcher({ url: "/graphql" })}
        defaultQuery={defaultQuery}
        variables={variables}
      />
    </div>
  );
}

export function links(): LinkDescriptor[] {
  return [{ rel: "stylesheet", href: graphiqlStyles }];
}
