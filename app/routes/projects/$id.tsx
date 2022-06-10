import { useLoaderData } from "@remix-run/react"
import { type LoaderFunction, json } from "@remix-run/server-runtime"

import { type ProjectProps } from "~/features/projects"
import { getProjectDetails } from "~/features/projects/service.server"
import { ErrorSection } from "~/packages/components/Error"
import Hero from "~/packages/components/Hero"
// import Section from "~/packages/components/Section"
import { Paragraph } from "~/packages/components/Text"

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
  const { title, subtitle, description } = project

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
        />
        {description ? (
          <Paragraph className="text-tertiary">{description}</Paragraph>
        ) : null}
      </Hero>
    </>
  )
}

export function ErrorBoundary({ error }: { error: Error }) {
  return <ErrorSection title="Project not found" message={error.message} />
}
