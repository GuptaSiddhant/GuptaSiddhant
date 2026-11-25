import { type LoaderFunctionArgs, data, useLoaderData } from "react-router";

import { authenticateRoute } from "@gs/service/auth.server";
import { UserRole } from "@gs/models/users.model";
import { getCache } from "@gs/service/cache.server";
import { transformMsToReadableString } from "@gs/utils/format";

import AdminDashboard from "./features/components/AdminDashboard";
import { useAdminApp } from "./features/helpers";

interface LoaderData {
  max: number;
  size: number;
  ttl: number;
}

export async function loader({ request }: LoaderFunctionArgs) {
  await authenticateRoute(request, UserRole.ADMIN);
  const { size, max, ttl } = getCache();

  return data<LoaderData>({ size, max, ttl });
}

export default function CacheIndex(): JSX.Element | null {
  const { size, max, ttl } = useLoaderData<LoaderData>();
  const adminApp = useAdminApp();

  return (
    <AdminDashboard {...adminApp}>
      <AdminDashboard.Table
        data={[{ size, max, ttl }]}
        columns={[
          { id: "size", header: "Entries" },
          {
            id: "max",
            header: "Size limit",
            cell: ({ max }) => `${max} entries`,
          },
          {
            id: "ttl",
            header: "Expiry time",
            cell: ({ ttl }) => <span>{transformMsToReadableString(ttl)}</span>,
          },
        ]}
      />
    </AdminDashboard>
  );
}
