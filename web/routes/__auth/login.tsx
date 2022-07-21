import { Form, useActionData, useLoaderData } from "@remix-run/react"
import type { ActionFunction, LoaderFunction } from "@remix-run/server-runtime"
import { json } from "@remix-run/server-runtime"

import Hero from "@gs/hero"
import authenticator, { loginUser } from "@gs/service/auth.server"
import Button from "@gs/ui/Button"
import Input from "@gs/ui/Input"
import { Paragraph } from "@gs/ui/Text"

interface LoaderData {
  redirectTo?: string
}

export const loader: LoaderFunction = async ({ request }) => {
  const redirectTo = new URL(request.url).searchParams
    .get("redirectTo")
    ?.toString()

  await authenticator.isAuthenticated(request, {
    successRedirect: "/admin",
  })

  return json<LoaderData>({ redirectTo })
}

interface ActionData {
  error?: string
}

export const action: ActionFunction = async ({ request }) => {
  try {
    return await loginUser(request)
  } catch (e: any) {
    return json<ActionData>({ error: e.message }, 400)
  }
}

export default function Login(): JSX.Element {
  const { redirectTo } = useLoaderData<LoaderData>()
  const actionData = useActionData<ActionData>()

  return (
    <Hero>
      <Hero.Header title="Login" />
      <Hero.Description>
        <Form method="post" className="flex flex-col gap-4">
          <fieldset className="flex flex-col gap-4 md:flex-row md:items-end">
            <Input
              label={<div>Email</div>}
              labelClassName="flex-1"
              type="email"
              name="email"
              className="w-full"
              required
              placeholder="Email"
              autoComplete="username"
              autoFocus
            />
            <Input
              label={<div>Password</div>}
              labelClassName="flex-1"
              type="password"
              name="password"
              className="w-full"
              required
              placeholder="Password"
              autoComplete="current-password"
            />
            <input type={"hidden"} name="redirectTo" value={redirectTo} />
            <Button.Primary type="submit">Login</Button.Primary>
          </fieldset>
          <Paragraph className="text-negative">
            {actionData?.error ? `Error: ${actionData.error}` : " "}
          </Paragraph>
        </Form>
      </Hero.Description>
    </Hero>
  )
}
