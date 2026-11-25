import { Suspense, lazy, useEffect, useState } from "react";

import {
  type MetaArgs,
  type MetaDescriptors,
  createMetaTitle,
  extractEssentialMetaFromMetaMatches,
} from "@gs/utils/meta";

const GraphiQLClient = lazy(() => import("@gs/graphql/GraphiQLClient"));

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
      <Suspense fallback={null}>
        <GraphiQLClient defaultQuery={defaultQuery} variables={variables} />
      </Suspense>
    </div>
  );
}

export function meta({ matches }: MetaArgs): MetaDescriptors {
  return [
    ...extractEssentialMetaFromMetaMatches(matches),
    { title: createMetaTitle("GraphQL") },
  ];
}
