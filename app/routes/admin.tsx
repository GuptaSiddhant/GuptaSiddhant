import { Form, Outlet } from "@remix-run/react"
import type { LoaderFunction } from "@remix-run/server-runtime"
import LogoutIcon from "remixicon-react/LogoutCircleRLineIcon"

import { fabBottomLeftClassName } from "~/packages/components/Button"
import { authenticateRoute } from "~/packages/service/auth.server"

export const loader: LoaderFunction = async ({ request }) => {
  return await authenticateRoute(request)
}

export default function AdminIndex(): JSX.Element {
  return (
    <>
      <Outlet />
      <Form method="post" action="/logout">
        <button className={fabBottomLeftClassName}>
          <LogoutIcon aria-label="Logout" />
        </button>
      </Form>
    </>
  )
}
