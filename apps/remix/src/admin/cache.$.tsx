import clsx from "clsx";

import { useLoaderData, useRouteError } from "@remix-run/react";
import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/server-runtime";
import { json, redirect } from "@remix-run/server-runtime";

import { ONE_HOUR_IN_MS } from "@gs/constants";
import useMediaQuery from "@gs/hooks/useMediaQuery";
import { DeleteIcon } from "@gs/icons";
import { authenticateRoute } from "@gs/service/auth.server";
import type { ModifyCacheMethod } from "@gs/service/cache.server";
import {
  getCache,
  getCachedKey,
  getCachedTypes,
  hasCachedKey,
  modifyCache,
  parseCacheKey,
} from "@gs/service/cache.server";
import type { NavigationLinkProps } from "@gs/types";
import Action from "@gs/ui/Action";
import CodeBlock from "@gs/ui/CodeBlock";
import { ErrorSection } from "@gs/ui/Error";
import { Caption, Paragraph } from "@gs/ui/Text";
import { transformMsToReadableString } from "@gs/utils/format";
import invariant from "@gs/utils/invariant";

import { AdminAppId, adminRegistry } from "./features";
import { createAdminMeta } from "./features/helpers";
import AdminLayout from "./features/layout";
import { getErrorMessage } from "@gs/utils/error";

interface LoaderData {
  key: string;
  type: string;
  value?: string;
  data: unknown;
  ttl: number;
}

const adminApp = adminRegistry.getApp(AdminAppId.Cache);
const onlyCacheTypeError = "cache-type" as const;

export const loader: LoaderFunction = async ({ params, request }) => {
  await authenticateRoute(request);
  const key = params["*"];
  invariant(key, "Cache key is required.");

  const { type, value } = parseCacheKey(key) || {};
  const allTypes = getCachedTypes();
  if (!(type && allTypes.includes(type))) {
    throw new Error(`Cache type "${type}" is invalid.`);
  }

  if (!hasCachedKey(key)) {
    if (!value) {
      throw new Error(`${onlyCacheTypeError}:${type}`);
    }

    return redirect(adminApp.linkPath + type);
  }

  const data = await getCachedKey(key);
  const ttl = getCache().getRemainingTTL(key);

  return json<LoaderData>({
    key,
    type,
    value,
    data,
    ttl,
  });
};

export const action: ActionFunction = async ({ request }) => {
  await authenticateRoute(request);

  const { pathname } = new URL(request.url);
  const form = await request.formData();
  const key = form.get("key")?.toString();

  invariant(key, "Cache key is required");
  await modifyCache(request.method as ModifyCacheMethod, key);

  if (request.method === "DELETE") {
    return redirect(adminApp.linkPath);
  }
  return redirect(pathname);
};

export default function CacheDetails(): JSX.Element | null {
  const { key, data } = useLoaderData<LoaderData>();

  const actions: NavigationLinkProps[] = [
    {
      id: "Delete",
      children: (
        <Action
          body={{ key }}
          title="Delete cache item"
          method="DELETE"
          action={adminApp.linkPath + key}
          toast={"Deleting cache item"}
        >
          <DeleteIcon />
        </Action>
      ),
    },
  ];

  return (
    <AdminLayout
      title={key}
      to={adminApp.linkPath + key}
      actions={actions}
      footer={<Footer />}
      className={clsx(data ? "flex flex-col gap-4 p-4" : "p-4 flex-center")}
    >
      {data ? (
        <CodeBlock lang="json" wrap codeClassName="text-sm" className="!m-0">
          {JSON.stringify(data, null, 2)}
        </CodeBlock>
      ) : (
        <Paragraph className="text-center text-base">
          The cache key does not contain any data.
          <br />
          <br />
          <span className="text-disabled">
            Maybe there was an error while fetching the data or the source gave
            an empty response.
          </span>
        </Paragraph>
      )}
    </AdminLayout>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  const message = getErrorMessage(error);

  if (!message.startsWith(onlyCacheTypeError)) {
    return <ErrorSection error={error} title="Problem with Cache key" />;
  }

  const type = message.split(":")[1];

  return (
    <div className="h-full flex-col gap-4 flex-center">
      <Caption>{type}</Caption>
      <Paragraph className="text-disabled">
        Pick an entry from the sidebar.
      </Paragraph>
      <Action
        title={`Clear cache for '${type}'.`}
        method="DELETE"
        confirm={`Are you sure about clearing '${type}' cache?`}
        toast={`Clearing '${type}' cache ...`}
        action={adminApp.linkPath + type}
        body={{ key: type }}
      >
        Clear cache
      </Action>
    </div>
  );
}

export const meta: MetaFunction = ({ data }) => {
  return createAdminMeta(data?.key);
};

//

function Footer() {
  const { ttl } = useLoaderData<LoaderData>();
  const isMobileWidth = useMediaQuery("(max-width: 768px)");

  return (
    <div className="text-sm text-disabled">
      {isMobileWidth ? "TTL: " : "Remaining time: "}
      {isMobileWidth
        ? new Intl.NumberFormat(undefined, {
            style: "unit",
            unit: "hour",
          }).format(ttl / ONE_HOUR_IN_MS)
        : transformMsToReadableString(ttl)}
    </div>
  );
}
