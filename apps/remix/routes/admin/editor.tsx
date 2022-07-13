import { Outlet, useLoaderData, useLocation } from "@remix-run/react"
import type {
  ErrorBoundaryComponent,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/server-runtime"
import { json } from "@remix-run/server-runtime"
import NewIcon from "remixicon-react/AddBoxFillIcon"

import { AdminAppId, adminRegistry } from "~/features/admin"
import { createAdminMeta } from "~/features/admin/helpers"
import AdminLayout from "~/features/admin/layout/AdminLayout"
import { type AdminNavbarGroupProps } from "~/features/admin/layout/AdminNavbar"
import type { AdminAppHandle } from "~/features/admin/types"
import {
  getCareerList,
  getEducationList,
} from "~/features/experiences/service.server"
import type { ExperienceProps } from "~/features/experiences/types"
import type { NavigationLinkProps } from "~/features/navigation/types"
import { authenticateRoute } from "~/features/service/auth.server"
import { DatabaseModel } from "~/features/service/database.server"
import { ErrorSection } from "~/features/ui/Error"
import Menu from "~/features/ui/Menu"
import { Caption } from "~/features/ui/Text"

const adminApp = adminRegistry.getApp(AdminAppId.Editor)

export interface LoaderData {
  entries: {
    id: DatabaseModel
    label: string
    list: ExperienceProps[]
  }[]
}

export const loader: LoaderFunction = async ({ request }) => {
  await authenticateRoute(request)
  const [careerList, educationList] = await Promise.all([
    getCareerList(),
    getEducationList(),
  ])

  const allEditableEntries: LoaderData["entries"] = [
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

  return json<LoaderData>({
    entries: allEditableEntries,
  })
}

export default function EditorAdminApp(): JSX.Element | null {
  const loaderData = useLoaderData<LoaderData>()
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
      header={<Caption>{adminApp.title}</Caption>}
      navGroups={navGroups}
      actions={actions}
    >
      <Outlet context={loaderData} />
    </AdminLayout>
  )
}

export const meta: MetaFunction = () => createAdminMeta(adminApp.title)

export const ErrorBoundary: ErrorBoundaryComponent = ({ error }) => {
  return (
    <ErrorSection title={`Problem with ${adminApp.title}.`} error={error} />
  )
}

export const handle: AdminAppHandle = { adminApp }
