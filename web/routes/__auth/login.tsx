import authenticator, { loginUser } from "@gs/service/auth.server"
import { generateWebAuthNRequest, WebAuthNType } from "@gs/webauthn"
import { Form, useActionData } from "@remix-run/react"
import type { ActionFunction, LoaderFunction } from "@remix-run/server-runtime"
import { json } from "@remix-run/server-runtime"
import {
  solveLoginChallenge,
  solveRegistrationChallenge,
} from "@webauthn/client"

import Hero from "~/features/hero"
import Button from "~/features/ui/Button"
import Input from "~/features/ui/Input"
import { Paragraph } from "~/features/ui/Text"

export const loader: LoaderFunction = async ({ request }) => {
  return await authenticator.isAuthenticated(request, {
    successRedirect: "/admin",
  })
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
  const actionData = useActionData<ActionData>()

  return (
    <Hero>
      <Hero.Header title="Login" />
      <Hero.Description>
        <Button onClick={() => register("gs")}>Register</Button>
        <Button onClick={() => login("gs")}>Login</Button>

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

async function register(username: string) {
  const challenge = await generateWebAuthNRequest(
    WebAuthNType.RequestRegister,
    { id: "uuid", username },
  )
  const { loggedIn } = await generateWebAuthNRequest(
    WebAuthNType.Register,
    await solveRegistrationChallenge(challenge),
  )

  console.log({ username, loggedIn })
}

async function login(username: string) {
  const challenge = await generateWebAuthNRequest(WebAuthNType.Login, {
    username,
  })
  const { loggedIn } = await generateWebAuthNRequest(
    WebAuthNType.Register,
    await solveLoginChallenge(challenge),
  )

  console.log({ loggedIn })
}
