import {
  Outlet,
  type ShouldReloadFunction,
  useLoaderData,
} from "@remix-run/react";
import {
  // type ActionFunction,
  type ErrorBoundaryComponent,
  type HeadersFunction,
  type LinksFunction,
  type LoaderFunction,
  type MetaFunction,
  json,
  // redirect,
} from "@remix-run/server-runtime";

import { createMetaTitle } from "@gs/helpers/meta";
import { CatchBoundarySection, ErrorSection } from "@gs/ui/Error";

interface LoaderData {
  foo?: string;
}

export const loader: LoaderFunction = async () => {
  return json<LoaderData>({});
};

/*
export const action: ActionFunction = async ({ request }) => {
  const { pathname } = new URL(request.url)

  return redirect(pathname)
}
*/

export const headers: HeadersFunction = () => ({});

export const meta: MetaFunction = () => ({ title: createMetaTitle("") });

export const links: LinksFunction = () => [];

export default function Page(): JSX.Element | null {
  const loaderData = useLoaderData<LoaderData>();

  return <Outlet context={loaderData} />;
}

export const CatchBoundary = () => {
  return <CatchBoundarySection />;
};

export const ErrorBoundary: ErrorBoundaryComponent = ({ error }) => {
  return <ErrorSection error={error} />;
};

export const unstable_shouldReload: ShouldReloadFunction = () => true;

export const handle = {};
