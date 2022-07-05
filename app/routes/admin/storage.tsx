import { Form, useLoaderData, useSubmit } from "@remix-run/react"
import {
  type ActionFunction,
  type LoaderFunction,
  json,
  redirect,
} from "@remix-run/server-runtime"
import StorageIcon from "remixicon-react/HardDrive2FillIcon"

import type { AdminAppProps } from "~/features/admin"
import { createAdminMeta } from "~/features/admin"
import AdminLayout from "~/features/admin/AdminLayout"
import { generateNavbarGroupsFromFirebaseStorageDirsFiles } from "~/features/admin/storage/helpers"
import { modifyStorage } from "~/features/admin/storage/service.server"
import { RefreshIcon, UploadIcon } from "~/features/icons"
import type { NavigationLinkProps } from "~/features/navigation/types"
import {
  type FirebaseStorageFile,
  getFirebaseStorageFiles,
} from "~/features/service/storage.server"
import { ErrorSection } from "~/features/ui/Error"
import FormAction from "~/features/ui/FormAction"
import { Caption } from "~/features/ui/Text"

const adminApp: AdminAppProps = {
  id: "storage",
  name: "Storage",
  icon: <StorageIcon />,
  to: "/admin/storage",
}

interface LoaderData {
  dirs: string[]
  files: FirebaseStorageFile[]
}

export const loader: LoaderFunction = async ({ request }) => {
  const { dirs, files } = await getFirebaseStorageFiles()

  return json<LoaderData>({ dirs, files })
}

export const action: ActionFunction = async ({ request }) => {
  const { method } = request
  const form = await request.formData()
  // const origin = form.get("origin")?.toString() || "/"

  await modifyStorage(method, form)

  return redirect(new URL(request.url).pathname)
}

export default function StorageAdminApp(): JSX.Element | null {
  const { dirs, files } = useLoaderData<LoaderData>()
  const actions: NavigationLinkProps[] = [
    {
      id: "upload",
      children: <Uploader />,
    },
    {
      id: "refresh",
      children: (
        <FormAction method="get" title="Refresh">
          <RefreshIcon />
        </FormAction>
      ),
    },
  ]

  return (
    <AdminLayout
      {...adminApp}
      actions={actions}
      navGroups={generateNavbarGroupsFromFirebaseStorageDirsFiles(dirs, files)}
      header={<Caption>{adminApp.name}</Caption>}
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

export interface AdminSettingsOutletContext {
  featureConfigKeys: string[]
}

function Uploader() {
  const submit = useSubmit()

  return (
    <Form
      method="post"
      title="Upload"
      encType="multipart/form-data"
      onChange={(e) => submit(e.currentTarget)}
    >
      <label htmlFor="file_upload" className="flex-center">
        <UploadIcon />
      </label>
      <input
        id="file_upload"
        type="file"
        name="filePath"
        multiple={false}
        className="hidden"
      />
      <input type="hidden" name="destination" value="xxx" />
    </Form>
  )
}
