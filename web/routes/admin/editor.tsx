import NewIcon from "remixicon-react/AddBoxFillIcon"

import { Outlet, useLoaderData, useLocation } from "@remix-run/react"
import {
  type ErrorBoundaryComponent,
  type LoaderFunction,
  type MetaFunction,
  json,
} from "@remix-run/server-runtime"

import { AdminAppId, adminRegistry } from "@gs/admin"
import { createAdminMeta } from "@gs/admin/helpers"
import AdminLayout from "@gs/admin/layout/AdminLayout"
import { type AdminNavbarGroupProps } from "@gs/admin/layout/AdminNavbar"
import type { AdminAppHandle } from "@gs/admin/types"
import { getBlogPostKeys } from "@gs/blog/service.server"
import { getCareerKeys, getEducationKeys } from "@gs/experiences/service.server"
import type { NavigationLinkProps } from "@gs/navigation/types"
import { getProjectsKeys } from "@gs/projects/service.server"
import { authenticateRoute } from "@gs/service/auth.server"
import { DatabaseModel } from "@gs/service/database.server"
import { ErrorSection } from "@gs/ui/Error"
import Menu from "@gs/ui/Menu"
import { Caption } from "@gs/ui/Text"

const adminApp = adminRegistry.getApp(AdminAppId.Editor)

export interface LoaderData {
  entries: {
    id: DatabaseModel
    label: string
    keys: string[]
  }[]
}

export const loader: LoaderFunction = async ({ request }) => {
  await authenticateRoute(request)
  const [careerKeys, educationKeys, blogKeys, projectsKeys] = await Promise.all(
    [getCareerKeys(), getEducationKeys(), getBlogPostKeys(), getProjectsKeys()],
  )

  const allEditableEntries: LoaderData["entries"] = [
    {
      id: DatabaseModel.Career,
      label: "Career",
      keys: careerKeys,
    },
    {
      id: DatabaseModel.Education,
      label: "Education",
      keys: educationKeys,
    },
    {
      id: DatabaseModel.Blog,
      label: "Blog",
      keys: blogKeys,
    },
    {
      id: DatabaseModel.Projects,
      label: "Project",
      keys: projectsKeys,
    },
  ].sort((a, b) => a.label.localeCompare(b.label))

  return json<LoaderData>({
    entries: allEditableEntries,
  })
}

export default function EditorAdminApp(): JSX.Element | null {
  const loaderData = useLoaderData<LoaderData>()
  const { entries } = loaderData
  const { pathname } = useLocation()

  const navGroups: AdminNavbarGroupProps[] = entries.map(
    ({ id, label, keys }) => ({
      id,
      label,
      showCount: true,
      openByDefault: pathname.includes(id),
      children: keys.map((key) => ({
        id: key,
        children: key,
        to: `${id}/${key}`,
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
