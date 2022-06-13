import { useLoaderData } from "@remix-run/react"
import {
  type LoaderFunction,
  type MetaFunction,
  json,
} from "@remix-run/server-runtime"

import { type ProjectProps } from "~/features/projects"
import {
  getProjectCrossSell,
  getProjectDetails,
} from "~/features/projects/service.server"
import Divider from "~/packages/components/Divider"
import { ErrorSection } from "~/packages/components/Error"
import Hero from "~/packages/components/Hero"
import ShareTray from "~/packages/components/ShareTray"
import Tags from "~/packages/components/Tags"
import { H2 } from "~/packages/components/Text"
import { generateArticleMeta } from "~/packages/helpers/meta"
import {
  type TocItem,
  extractTocFromMdx,
  transformContentToMdx,
} from "~/packages/mdx/helpers"
import MdxSection from "~/packages/mdx/MdxSection"
import { type TeaserProps } from "~/packages/teaser"
import TeaserCarousel from "~/packages/teaser/TeaserCarousel"

interface LoaderData {
  project: ProjectProps
  url: string
  mdx?: string
  toc?: TocItem[]
  crossSell: TeaserProps[]
}

export const loader: LoaderFunction = async ({ params, request }) => {
  const id = params.id
  if (!id) throw new Error("Project id is required")

  try {
    const { content, ...project } = await getProjectDetails(id)
    const mdx = transformContentToMdx(content)
    const toc = extractTocFromMdx(mdx)
    const crossSell = await getProjectCrossSell(id)

    return json<LoaderData>({
      project,
      url: request.url,
      mdx,
      toc,
      crossSell,
    })
  } catch (e: any) {
    const reason = __IS_DEV__ ? `Reason: ${e?.message}` : ""
    throw new Error(`Failed to load project '${id}'. ${reason}`)
  }
}

export const meta: MetaFunction = ({ data, params }) =>
  generateArticleMeta(data?.project, {
    url: data?.url,
    id: params.id,
    section: "Project",
  })

export default function ProjectDetails(): JSX.Element {
  const { project, url, mdx, toc, crossSell } = useLoaderData<LoaderData>()
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

        <Hero.Description description={description}>
          <Tags.List tags={tags.sort()} className="justify-start" />
        </Hero.Description>

        <Hero.Image src={cover} alt={title} icon={icon} />
      </Hero>

      <MdxSection mdx={mdx} toc={toc} />

      <Divider />

      <TeaserCarousel teasers={crossSell} linkBaseUrl="/projects/">
        <H2>More like this</H2>
      </TeaserCarousel>
    </>
  )
}

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <ErrorSection
      caption="Error 404"
      title="Project not found"
      message={error.message}
    >
      {error.stack}
    </ErrorSection>
  )
}
