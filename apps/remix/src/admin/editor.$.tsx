import { useLoaderData } from "@remix-run/react";
import type {
  ActionFunction,
  ErrorBoundaryComponent,
  LoaderFunction,
} from "@remix-run/server-runtime";
import { json, redirect } from "@remix-run/server-runtime";

import { ModelName } from "@gs/models";
import { authenticateRoute } from "@gs/service/auth.server";
import Database from "@gs/service/database.server";
import Action from "@gs/ui/Action";
import { ErrorSection } from "@gs/ui/Error";
import { Caption, Paragraph } from "@gs/ui/Text";
import invariant from "@gs/utils/invariant";

import { AdminAppId, adminRegistry } from "./features";

const adminApp = adminRegistry.getApp(AdminAppId.Storage);

interface LoaderData {
  collection?: string;
}

export const loader: LoaderFunction = async ({ params, request }) => {
  await authenticateRoute(request);

  const path = params["*"];
  if (!path) return redirect(adminApp.linkPath);

  const [collection, id] = path.split("/");

  if (id) throw new Error("404");

  if (!Object.values(ModelName).includes(collection as ModelName)) {
    return redirect(adminApp.linkPath);
  } else return json<LoaderData>({ collection });
};

export const action: ActionFunction = async ({ request }) => {
  await authenticateRoute(request);
  const { pathname } = new URL(request.url);
  const formData = await request.formData();
  const collection = formData.get("collection")?.toString();

  if (request.method === "PATCH") {
    invariant(collection, "collection is required");
    Database.clearCache(collection);
  }

  return redirect(pathname);
};

export default function Error404(): JSX.Element | null {
  const { collection } = useLoaderData<LoaderData>();

  return (
    <div className="h-full flex-col gap-4 flex-center">
      <Caption>{collection}</Caption>
      <Paragraph className="text-disabled">
        Pick an entry from the sidebar.
      </Paragraph>
      <Action
        method="patch"
        body={{ collection }}
        title="Clear cache"
        toast={`Clearing ${collection} cache...`}
      >
        Clear cache
      </Action>
    </div>
  );
}

export const ErrorBoundary: ErrorBoundaryComponent = () => {
  return (
    <ErrorSection
      caption={"Error 404"}
      title="Editor id not found"
      message="Oops! Looks like you tried to visit an entry that does not exist."
    />
  );
};
