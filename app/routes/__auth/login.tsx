import { Form, useActionData } from "@remix-run/react"
import type { ActionFunction, LoaderFunction } from "@remix-run/server-runtime"
import { redirect } from "@remix-run/server-runtime"
import { json } from "@remix-run/server-runtime"

import CodeBlock from "~/packages/components/CodeBlock"
import Section from "~/packages/components/Section"
import authenticator from "~/packages/service/auth.server"
import cookieSession from "~/packages/service/session.server"

export const loader: LoaderFunction = async ({ request }) => {
  return await authenticator.isAuthenticated(request, {
    successRedirect: "/admin",
  })
}

export const action: ActionFunction = async ({ request }) => {
  try {
    const user = await authenticator.authenticate("emailPassword", request, {
      throwOnError: true,
    })

    const session = await cookieSession.getSession(
      request.headers.get("cookie"),
    )
    session.set(authenticator.sessionKey, user)
    const headers = new Headers({
      "Set-Cookie": await cookieSession.commitSession(session),
    })

    return redirect("/admin", { headers })
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
