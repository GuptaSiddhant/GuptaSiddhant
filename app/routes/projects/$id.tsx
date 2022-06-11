import { useLoaderData } from "@remix-run/react"
import {
  type LoaderFunction,
  type MetaFunction,
  json,
} from "@remix-run/server-runtime"

import { type ProjectProps, generateProjectMeta } from "~/features/projects"
import { getProjectDetails } from "~/features/projects/service.server"
import { CopyButton } from "~/packages/components/Button"
import { ErrorSection } from "~/packages/components/Error"
import Hero from "~/packages/components/Hero"
import Tags from "~/packages/components/Tags"

interface LoaderData {
  project: ProjectProps
  url: string
}

export const loader: LoaderFunction = async ({ params, request }) => {
  const id = params.id
  if (!id) throw new Error("Project id is required")

  try {
    const project = await getProjectDetails(id)

    return json<LoaderData>({ project, url: request.url })
  } catch (e: any) {
    const reason = __IS_DEV__ ? `Reason: ${e?.message}` : ""
    throw new Error(`Failed to load project '${id}'. ${reason}`)
  }
}

export const meta: MetaFunction = ({ data, params }) =>
  generateProjectMeta(data?.project, data?.url, params.id)

export default function ProjectDetails(): JSX.Element {
  const { project } = useLoaderData<LoaderData>()
  const { title, subtitle, description, cover, icon, tags = [] } = project

  return (
    <>
      <Hero>
        <Hero.Header
          caption={{
            to: "/projects",
            label: "Project",
            icon: "back",
          }}
          title={title}
          subtitle={subtitle}
        >
          <Actions />
        </Hero.Header>
        <Hero.Description description={description} />
        <Hero.Image src={cover} alt={title} icon={icon} />
      </Hero>

      <Tags.List tags={tags} className="justify-start" />
    </>
  )
}

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <ErrorSection
      caption="Error 404"
      title="Project not found"
      message={error.message}
    />
  )
}

function Actions(): JSX.Element | null {
  const url = String(useLoaderData()?.url) || undefined

  return (
    <div className="flex flex-end gap-4 items-center">
      <CopyButton>{url}</CopyButton>
    </div>
  )
}
