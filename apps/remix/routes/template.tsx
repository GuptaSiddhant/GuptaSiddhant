import { CatchBoundarySection, ErrorSection } from "@features/ui/Error"
import {
  type ShouldReloadFunction,
  Outlet,
  useLoaderData,
} from "@remix-run/react"
import {
  type ActionFunction,
  type ErrorBoundaryComponent,
  type HeadersFunction,
  type LinksFunction,
  type LoaderFunction,
  type MetaFunction,
  json,
  redirect,
} from "@remix-run/server-runtime"

interface LoaderData {}

export const loader: LoaderFunction = async () => {
  return json<LoaderData>({})
}

export const action: ActionFunction = async ({ request }) => {
  const { pathname } = new URL(request.url)

  return redirect(pathname)
}

export const headers: HeadersFunction = () => ({})

export const meta: MetaFunction = () => ({})

export const links: LinksFunction = () => []

export default function Page(): JSX.Element | null {
  const loaderData = useLoaderData<LoaderData>()

  return <Outlet context={loaderData} />
}

export const CatchBoundary = () => {
  return <CatchBoundarySection />
}

export const ErrorBoundary: ErrorBoundaryComponent = ({ error }) => {
  return <ErrorSection error={error} />
}

export const unstable_shouldReload: ShouldReloadFunction = () => true

export const handle: any = {}
