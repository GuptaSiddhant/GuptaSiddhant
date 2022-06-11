import { useLoaderData } from "@remix-run/react"
import {
  type LoaderFunction,
  type MetaFunction,
  json,
} from "@remix-run/server-runtime"

import { type ProjectProps, generateProjectMeta } from "~/features/projects"
import { getProjectDetails } from "~/features/projects/service.server"
import { ErrorSection } from "~/packages/components/Error"
import Hero from "~/packages/components/Hero"
import ShareTray from "~/packages/components/ShareTray"
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
  const { project, url } = useLoaderData<LoaderData>()
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
          <ShareTray url={url} />
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
