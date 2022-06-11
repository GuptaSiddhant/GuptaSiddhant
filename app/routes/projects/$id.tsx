import { useLoaderData } from "@remix-run/react"
import { type LoaderFunction, json } from "@remix-run/server-runtime"
import ShareIcon from "remixicon-react/ShareForwardLineIcon"

import { type ProjectProps } from "~/features/projects"
import { getProjectDetails } from "~/features/projects/service.server"
import { ErrorSection } from "~/packages/components/Error"
import Hero from "~/packages/components/Hero"
import Tags from "~/packages/components/Tags"

interface LoaderData {
  project: ProjectProps
}

export const loader: LoaderFunction = async ({ params }) => {
  const id = params.id
  if (!id) throw new Error("Project id is required")

  try {
    const project = await getProjectDetails(id)

    return json<LoaderData>({ project })
  } catch (e: any) {
    throw new Error(`Failed to load project '${id}'. Reason: ${e?.message}`)
  }
}

export default function ProjectDetails(): JSX.Element {
  const { project } = useLoaderData<LoaderData>()
  const { title, subtitle, description, gallery, icon, tags = [] } = project
  const cover: string | undefined = gallery?.[0]?.url

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
          <button>
            <ShareIcon />
          </button>
        </Hero.Header>
        <Hero.Description description={description} />
        <Hero.Image src={cover} alt={title} icon={icon} />
      </Hero>

      <Tags.List tags={tags} className="justify-start" />
    </>
  )
}

export function ErrorBoundary({ error }: { error: Error }) {
  return <ErrorSection title="Project not found" message={error.message} />
}
