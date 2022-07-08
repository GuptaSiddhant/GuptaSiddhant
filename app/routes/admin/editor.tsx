import { Outlet, useLoaderData, useLocation } from "@remix-run/react"
import { type LoaderFunction, json } from "@remix-run/server-runtime"
import NewIcon from "remixicon-react/AddBoxFillIcon"
import EditorIcon from "remixicon-react/EditBoxFillIcon"

import type { AdminAppProps } from "~/features/admin"
import { createAdminMeta } from "~/features/admin"
import AdminLayout from "~/features/admin/AdminLayout"
import { type AdminNavbarGroupProps } from "~/features/admin/AdminNavbar"
import {
  getCareerList,
  getEducationList,
} from "~/features/experiences/service.server"
import type { ExperienceProps } from "~/features/experiences/types"
import type { NavigationLinkProps } from "~/features/navigation/types"
import { DatabaseModel } from "~/features/service/database.server"
import { ErrorSection } from "~/features/ui/Error"
import Menu from "~/features/ui/Menu"
import { Caption } from "~/features/ui/Text"

const adminApp: AdminAppProps = {
  id: "editor",
  name: "Editor",
  icon: <EditorIcon />,
  to: "/admin/editor",
}

export interface EditorLoaderData {
  entries: {
    id: DatabaseModel
    label: string
    list: ExperienceProps[]
  }[]
}

export const loader: LoaderFunction = async () => {
  const [careerList, educationList] = await Promise.all([
    getCareerList(),
    getEducationList(),
  ])

  const allEditableEntries: EditorLoaderData["entries"] = [
    {
      id: DatabaseModel.Career,
      label: "Career",
      list: careerList,
    },
    {
      id: DatabaseModel.Education,
      label: "Education",
      list: educationList,
    },
  ]

  return json<EditorLoaderData>({
    entries: allEditableEntries,
  })
}

export default function EditorAdminApp(): JSX.Element | null {
  const loaderData = useLoaderData<EditorLoaderData>()
  const { entries } = loaderData
  const { pathname } = useLocation()

  const navGroups: AdminNavbarGroupProps[] = entries.map(
    ({ id, label, list }) => ({
      id,
      label,
      showCount: true,
      openByDefault: pathname.includes(id),
      children: list.map((item) => ({
        id: item.id,
        children: item.id,
        to: `${id}/${item.id}`,
      })),
    }),
  )

  const actions: NavigationLinkProps[] = [
    {
      id: "new",
      children: (
        <Menu
          actions={entries.map((e) => ({
            id: e.id,
            children: "New " + e.label,
            to: `${e.id}/new`,
          }))}
        >
          <NewIcon />
        </Menu>
      ),
    },
  ]

  return (
    <AdminLayout
      {...adminApp}
      header={<Caption>{adminApp.name}</Caption>}
      navGroups={navGroups}
      actions={actions}
    >
      <Outlet context={loaderData} />
    </AdminLayout>
  )
}

export function ErrorBoundary({ error }: { error: Error }) {
  return <ErrorSection title={`Problem with ${adminApp.name}.`} error={error} />
}

export const handle = { adminApp }

export function meta() {
  return createAdminMeta(adminApp.name)
}
