import { Link, useLoaderData } from "@remix-run/react"
import type { ErrorBoundaryComponent } from "@remix-run/server-runtime"
import {
  type LoaderFunction,
  type MetaFunction,
  json,
} from "@remix-run/server-runtime"

import { type BlogPostProps } from "@gs/blog"
import {
  getBlogPostCrossSell,
  getBlogPostDetails,
} from "@gs/blog/service.server"
import {
  extractTocFromMdx,
  transformContentToMdx,
} from "@gs/helpers/mdx.server"
import { generateArticleMeta } from "@gs/helpers/meta"
import { type TocItem } from "@gs/helpers/table-of-contents"
import Hero from "@gs/hero"
import { EditIcon } from "@gs/icons"
import { getAuthUser } from "@gs/service/auth.server"
import { type TeaserProps } from "@gs/teaser"
import TeaserCarousel from "@gs/teaser/TeaserCarousel"
import Divider from "@gs/ui/Divider"
import { ErrorSection } from "@gs/ui/Error"
import Mdx from "@gs/ui/Mdx"
import Reader from "@gs/ui/Reader"
import ShareTray from "@gs/ui/ShareTray"
import TableOfContent from "@gs/ui/TableOfContent"
import Tags from "@gs/ui/Tags"
import { H2 } from "@gs/ui/Text"

interface LoaderData {
  post: BlogPostProps
  url: string
  mdx?: string
  toc?: TocItem[]
  crossSell: TeaserProps[]
  isAuthenticated: boolean
}

export const loader: LoaderFunction = async ({ params, request }) => {
  const id = params.id
  if (!id) throw new Error("Blog post id is required")

  const isAuthenticated = Boolean(await getAuthUser(request))

  try {
    const { content, ...post } = await getBlogPostDetails(id)
    const mdx = transformContentToMdx(content)
    const toc = extractTocFromMdx(mdx)
    const crossSell = await getBlogPostCrossSell(id)

    return json<LoaderData>({
      post,
      url: request.url,
      mdx,
      toc,
      crossSell,
      isAuthenticated,
    })
  } catch (e: any) {
    const reason = __IS_DEV__ ? `Reason: ${e?.message}` : ""
    throw new Error(`Failed to load blog post '${id}'. ${reason}`)
  }
}

export const meta: MetaFunction = ({ data, params }) =>
  generateArticleMeta(data?.post, {
    url: data?.url,
    id: params.id,
    section: "Blog",
  })

export default function ProjectDetails(): JSX.Element {
  const {
    post,
    url,
    mdx,
    toc = [],
    crossSell,
    isAuthenticated,
  } = useLoaderData<LoaderData>()
  const { id, title, subtitle, description, cover, icon, tags = [] } = post

  return (
    <>
      <Hero>
        <Hero.Header
          caption={{
            to: "/blog",
            label: "Blog",
            icon: "back",
          }}
          title={title}
          subtitle={subtitle}
        >
          {isAuthenticated ? (
            <Link
              to={"/admin/editor/blog/" + id}
              className="w-max"
              title="Edit"
            >
              <EditIcon />
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

      <TeaserCarousel teasers={crossSell} linkBaseUrl="/blog/">
        <H2>More like this</H2>
      </TeaserCarousel>
    </>
  )
}

export const ErrorBoundary: ErrorBoundaryComponent = ({ error }) => {
  return (
    <ErrorSection
      caption="Error 404"
      title="Blog post not found"
      error={error}
    />
  )
}
