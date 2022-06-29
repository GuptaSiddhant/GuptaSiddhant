import { Form, useActionData } from "@remix-run/react"
import type { ActionFunction, LoaderFunction } from "@remix-run/server-runtime"
import { json } from "@remix-run/server-runtime"

import authenticator, { loginUser } from "~/features/service/auth.server"
import CodeBlock from "~/features/ui/CodeBlock"
import Section from "~/features/ui/Section"

export const loader: LoaderFunction = async ({ request }) => {
  return await authenticator.isAuthenticated(request, {
    successRedirect: "/admin",
  })
}

export const action: ActionFunction = async ({ request }) => {
  try {
    return await loginUser(request)
  } catch (e: any) {
    return json({ error: e.message }, 400)
  }
}

export default function Login(): JSX.Element {
  const actionData = useActionData()

  return (
    <Section.Prose>
      <Form method="post">
        <input
          type="email"
          name="email"
          className="bg-default"
          required
          placeholder="Email"
        />
        <input
          type="password"
          name="password"
          className="bg-default"
          required
          placeholder="Password"
        />
        <button>Login</button>
      </Form>
      <CodeBlock lang="json">
        {JSON.stringify(actionData || null, null, 2)}
      </CodeBlock>
    </Section.Prose>
  )
}
