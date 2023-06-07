import { useLoaderData } from "@remix-run/react";
import { type DataFunctionArgs, json } from "@remix-run/server-runtime";

import useRootContext from "@gs/root/RootContext";
import { authenticateRoute } from "@gs/service/auth.server";
import Storage, { type StorageMetadata } from "@gs/service/storage.server";
import { ExternalLink } from "@gs/ui/Link";
import { formatDateTime } from "@gs/utils/format";

import AdminDashboard from "./features/components/AdminDashboard";
import { useAdminApp } from "./features/helpers";

interface LoaderData {
  metadata?: StorageMetadata;
}

export async function loader({ request }: DataFunctionArgs) {
  await authenticateRoute(request);
  try {
    const metadata = await Storage.queryMetadata();

    return json<LoaderData>({ metadata });
  } catch {
    return json<LoaderData>({});
  }
}

export default function StorageIndex(): JSX.Element | null {
  const { locale } = useRootContext();
  const { metadata } = useLoaderData<LoaderData>();
  const adminApp = useAdminApp();

  if (!metadata) {
    return <AdminDashboard {...adminApp}>{null}</AdminDashboard>;
  }

  return (
    <AdminDashboard {...adminApp}>
      <AdminDashboard.Table
        data={[metadata]}
        columns={[
          {
            id: "id",
            header: "Name",
            cell: (row) => (
              <ExternalLink href={row.link}>{row.name || row.id}</ExternalLink>
            ),
          },
          { id: "location" },
          {
            id: "updateTimestamp",
            header: "Last Updated",
            cell: (row) => formatDateTime(row.updateTimestamp, { locale }),
          },
        ]}
      />
    </AdminDashboard>
  );
}
