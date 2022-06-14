import { Form, Outlet, useLoaderData } from "@remix-run/react"
import type { LoaderFunction } from "@remix-run/server-runtime"

import CodeBlock from "~/packages/components/CodeBlock"
import Section from "~/packages/components/Section"
import type { AuthUser } from "~/packages/service/auth.server"
import { authenticateRoute } from "~/packages/service/auth.server"

export const loader: LoaderFunction = async ({ request }) => {
  return await authenticateRoute(request)
}

export default function AdminIndex(): JSX.Element {
  const loaderData = useLoaderData<AuthUser>()

  return (
    <Section>
      <Outlet />
      <Form method="post" action="/logout">
        <input type="hidden" name="redirectTo" defaultValue="/admin" />
        <button>Logout</button>
      </Form>
      <CodeBlock lang="json">
        {JSON.stringify({ loaderData }, null, 2)}
      </CodeBlock>
    </Section>
  )
}
