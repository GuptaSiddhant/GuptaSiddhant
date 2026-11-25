import { Suspense, lazy, useEffect, useState } from "react";

import { AdminAppId, adminRegistry } from "./features";
import { createAdminMeta } from "./features/helpers";

const adminApp = adminRegistry.getApp(AdminAppId.GraphQL);

const GraphiQLClient = lazy(() => import("@gs/graphql/GraphiQLClient"));

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
    <Suspense fallback={null}>
      <GraphiQLClient defaultQuery={defaultQuery} variables={variables} />
    </Suspense>
  );
}

export const meta = createAdminMeta(adminApp.title);
