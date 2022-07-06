import { useLoaderData } from "@remix-run/react"
import { type LoaderFunction, json } from "@remix-run/server-runtime"
import EditorIcon from "remixicon-react/EditBoxFillIcon"

import type { AdminAppProps } from "~/features/admin"
import { createAdminMeta } from "~/features/admin"
import AdminLayout from "~/features/admin/AdminLayout"
import { type AdminNavbarGroupProps } from "~/features/admin/AdminNavbar"
import { ErrorSection } from "~/features/ui/Error"
import { Caption } from "~/features/ui/Text"

const adminApp: AdminAppProps = {
  id: "editor",
  name: "Editor",
  icon: <EditorIcon />,
  to: "/admin/editor",
}

interface LoaderData {}

export const loader: LoaderFunction = async () => {
  return json<LoaderData>({})
}

export default function EditorAdminApp(): JSX.Element | null {
  const {} = useLoaderData<LoaderData>()

  const navGroups: AdminNavbarGroupProps[] = [
    {
      id: "projects",
      label: "Projects",
      children: [],
    },
  ]

  return (
    <AdminLayout
      {...adminApp}
      header={<Caption>{adminApp.name}</Caption>}
      navGroups={navGroups}
    />
  )
}

export function ErrorBoundary({ error }: { error: Error }) {
  return <ErrorSection title={`Problem with ${adminApp.name}.`} error={error} />
}

export const handle = { adminApp }

export function meta() {
  return createAdminMeta(adminApp.name)
}
