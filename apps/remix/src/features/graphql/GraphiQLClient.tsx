import { createGraphiQLFetcher } from "@graphiql/toolkit";
import { GraphiQL } from "graphiql";
import "graphiql/setup-workers/vite";
import "graphiql/style.css";

export interface GraphiQLClientProps {
  defaultQuery: string;
  variables: string;
}

const fetcher = createGraphiQLFetcher({ url: "/graphql" });

/** GraphiQL needs browser APIs (Monaco): only load it on the client. */
export default function GraphiQLClient({
  defaultQuery,
  variables,
}: GraphiQLClientProps) {
  return (
    <GraphiQL
      fetcher={fetcher}
      defaultQuery={defaultQuery}
      initialVariables={variables}
    />
  );
}
