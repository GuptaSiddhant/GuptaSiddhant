import NewIcon from "remixicon-react/AddBoxFillIcon"

import { Outlet, useLoaderData } from "@remix-run/react"
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
import { getLabelByModelName, ModelName } from "@gs/models"
import { getAboutKeys } from "@gs/models/about.server"
import { getBlogKeys } from "@gs/models/blog.server"
import { getCareerKeys } from "@gs/models/career.server"
import { getEducationKeys } from "@gs/models/education.server"
import { getProjectsKeys } from "@gs/models/projects.server"
import type { NavigationLinkProps } from "@gs/navigation/types"
import { authenticateRoute } from "@gs/service/auth.server"
import { ErrorSection } from "@gs/ui/Error"
import Menu from "@gs/ui/Menu"
import { Caption } from "@gs/ui/Text"

const adminApp = adminRegistry.getApp(AdminAppId.Editor)

export interface LoaderData {
  entries: {
    id: ModelName
    label: string
    keys: string[]
    allowNew?: boolean
  }[]
}

export const loader: LoaderFunction = async ({ request }) => {
  await authenticateRoute(request)
  const [careerKeys, educationKeys, blogKeys, projectsKeys, aboutKeys] =
    await Promise.all([
      getCareerKeys(),
      getEducationKeys(),
      getBlogKeys(),
      getProjectsKeys(),
      getAboutKeys(),
    ])

  const entries: LoaderData["entries"] = [
    { id: ModelName.About, keys: aboutKeys, allowNew: false },
    { id: ModelName.Career, keys: careerKeys },
    { id: ModelName.Education, keys: educationKeys },
    { id: ModelName.Blog, keys: blogKeys },
    { id: ModelName.Projects, keys: projectsKeys },
  ]
    .map((entry) => ({ ...entry, label: getLabelByModelName(entry.id) }))
    .sort((a, b) => a.label.localeCompare(b.label))

  return json<LoaderData>({ entries })
}

export default function EditorAdminApp(): JSX.Element | null {
  const loaderData = useLoaderData<LoaderData>()
  const { entries } = loaderData

  const navGroups: AdminNavbarGroupProps[] = entries.map(
    ({ id, label, keys }) => ({
      id,
      label,
      showCount: true,
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
          actions={entries
            .filter((e) => e.allowNew !== false)
            .map((e) => ({
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
