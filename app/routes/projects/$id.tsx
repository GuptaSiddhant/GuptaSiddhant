import { Link, useLoaderData } from "@remix-run/react"
import {
  type LoaderFunction,
  type MetaFunction,
  json,
} from "@remix-run/server-runtime"

import type { CommonCareerEducationProps } from "~/features/about"
import { getEducationOrCareerEntry } from "~/features/about/service.server"
import {
  extractTocFromMdx,
  transformContentToMdx,
} from "~/features/helpers/mdx.server"
import { generateArticleMeta } from "~/features/helpers/meta"
import { type TocItem } from "~/features/helpers/table-of-contents"
import Hero from "~/features/hero"
import { type ProjectProps } from "~/features/projects"
import {
  getProjectCrossSell,
  getProjectDetails,
} from "~/features/projects/service.server"
import { type TeaserProps } from "~/features/teaser"
import TeaserCarousel from "~/features/teaser/TeaserCarousel"
import Divider from "~/features/ui/Divider"
import { ErrorSection } from "~/features/ui/Error"
import Mdx from "~/features/ui/Mdx"
import Reader from "~/features/ui/Reader"
import ShareTray from "~/features/ui/ShareTray"
import TableOfContent from "~/features/ui/TableOfContent"
import Tags from "~/features/ui/Tags"
import { H2 } from "~/features/ui/Text"

interface LoaderData {
  project: ProjectProps
  url: string
  mdx?: string
  toc?: TocItem[]
  crossSell: TeaserProps[]
  assoc?: CommonCareerEducationProps
}

export const loader: LoaderFunction = async ({ params, request }) => {
  const id = params.id
  if (!id) throw new Error("Project id is required")

  try {
    const { content, association, ...project } = await getProjectDetails(id)
    const mdx = transformContentToMdx(content)
    const toc = extractTocFromMdx(mdx)
    const crossSell = await getProjectCrossSell(id)
    const assoc = await getEducationOrCareerEntry(association)

    return json<LoaderData>({
      project,
      url: request.url,
      mdx,
      toc,
      crossSell,
      assoc,
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
  const {
    project,
    url,
    mdx,
    toc = [],
    crossSell,
    assoc,
  } = useLoaderData<LoaderData>()
  const { title, subtitle, description, cover, icon, tags = [] } = project
  console.log({ icon: assoc?.icon })

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
          {assoc?.icon ? (
            <Link to={"/about/" + assoc.id}>
              <img
                src={assoc.icon}
                title={"company" in assoc ? assoc.company : assoc.school}
                alt={"company" in assoc ? assoc.company : assoc.school}
                className="mb-2 h-12 rounded-md object-contain"
                loading="eager"
              />
            </Link>
          ) : null}
        </Hero.Header>

        <Hero.Description description={description}>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Tags.List tags={tags.sort()} className="justify-start" />
            <ShareTray url={url} />
          </div>
        </Hero.Description>

        <Hero.Image src={cover} alt={title} icon={icon} />
      </Hero>

      <Reader id="main-content" leftColumn={<TableOfContent toc={toc} />}>
        <Mdx mdx={mdx} />
      </Reader>

      <Divider />

      <TeaserCarousel teasers={crossSell} linkBaseUrl="/projects/">
        <H2>More like this</H2>
      </TeaserCarousel>
    </>
  )
}

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <ErrorSection caption="Error 404" title="Project not found" error={error} />
  )
}
