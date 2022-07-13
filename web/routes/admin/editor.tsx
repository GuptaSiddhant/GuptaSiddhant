import { AdminAppId, adminRegistry } from "@gs/admin"
import { createAdminMeta } from "@gs/admin/helpers"
import AdminLayout from "@gs/admin/layout/AdminLayout"
import { type AdminNavbarGroupProps } from "@gs/admin/layout/AdminNavbar"
import type { AdminAppHandle } from "@gs/admin/types"
import { getCareerList, getEducationList } from "@gs/experiences/service.server"
import type { ExperienceProps } from "@gs/experiences/types"
import type { NavigationLinkProps } from "@gs/navigation/types"
import { authenticateRoute } from "@gs/service/auth.server"
import { DatabaseModel } from "@gs/service/database.server"
import { ErrorSection } from "@gs/ui/Error"
import Menu from "@gs/ui/Menu"
import { Caption } from "@gs/ui/Text"
import { Outlet, useLoaderData, useLocation } from "@remix-run/react"
import type {
  ErrorBoundaryComponent,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/server-runtime"
import { json } from "@remix-run/server-runtime"
import NewIcon from "remixicon-react/AddBoxFillIcon"

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
