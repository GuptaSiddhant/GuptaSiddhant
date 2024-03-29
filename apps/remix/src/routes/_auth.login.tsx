import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { type DataFunctionArgs, json } from "@remix-run/server-runtime";

import authenticator, { loginUser } from "@gs/service/auth.server";
import Button from "@gs/ui/Button";
import Hero from "@gs/ui/Hero";
import Input from "@gs/ui/Input";
import { Paragraph } from "@gs/ui/Text";
import { getErrorMessage } from "@gs/utils/error";

interface LoaderData {
  redirectTo?: string;
}

export async function loader({ request }: DataFunctionArgs) {
  console.log("login-loader");
  const redirectTo = new URL(request.url).searchParams
    .get("redirectTo")
    ?.toString();

  await authenticator.isAuthenticated(request, {
    successRedirect: "/admin",
  });

  return json<LoaderData>({ redirectTo });
}

interface ActionData {
  error?: string;
}

export async function action({ request }: DataFunctionArgs) {
  try {
    return await loginUser(request);
  } catch (e) {
    const message = getErrorMessage(e);
    return json<ActionData>({ error: message }, 400);
  }
}

export default function Login(): JSX.Element {
  const { redirectTo } = useLoaderData<LoaderData>();
  const actionData = useActionData<ActionData>();

  return (
    <Hero>
      <Hero.Header title="Login" />
      <Hero.Description>
        <Form method="POST" className="flex flex-col gap-4">
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
  );
}
