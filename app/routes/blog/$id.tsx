import { useLoaderData } from "@remix-run/react"
import {
  type LoaderFunction,
  type MetaFunction,
  json,
} from "@remix-run/server-runtime"

import { type BlogPostProps } from "~/features/blog"
import {
  getBlogPostCrossSell,
  getBlogPostDetails,
} from "~/features/blog/service.server"
import {
  extractTocFromMdx,
  transformContentToMdx,
} from "~/features/helpers/mdx.server"
import { generateArticleMeta } from "~/features/helpers/meta"
import { type TocItem } from "~/features/helpers/table-of-contents"
import Hero from "~/features/hero"
import { type TeaserProps } from "~/features/teaser"
import TeaserCarousel from "~/features/teaser/TeaserCarousel"
import Divider from "~/features/ui/Divider"
import { ErrorSection } from "~/features/ui/Error"
import Mdx from "~/features/ui/Mdx"
import Section from "~/features/ui/Section"
import ShareTray from "~/features/ui/ShareTray"
import Tags from "~/features/ui/Tags"
import { H2 } from "~/features/ui/Text"

interface LoaderData {
  post: BlogPostProps
  url: string
  mdx?: string
  toc?: TocItem[]
  crossSell: TeaserProps[]
}

export const loader: LoaderFunction = async ({ params, request }) => {
  const id = params.id
  if (!id) throw new Error("Blog post id is required")

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
  const { post, url, mdx, toc, crossSell } = useLoaderData<LoaderData>()
  const { title, subtitle, description, cover, icon, tags = [] } = post

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
        />

        <Hero.Description description={description}>
          <div className="flex justify-between items-center flex-wrap gap-4">
            <Tags.List tags={tags.sort()} className="justify-start" />
            <ShareTray url={url} />
          </div>
        </Hero.Description>

        <Hero.Image src={cover} alt={title} icon={icon} />
      </Hero>

      <Section.Reader id="main-content" toc={toc}>
        <Mdx mdx={mdx} />
      </Section.Reader>

      <Divider />

      <TeaserCarousel teasers={crossSell} linkBaseUrl="/blog/">
        <H2>More like this</H2>
      </TeaserCarousel>
    </>
  )
}

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <ErrorSection
      caption="Error 404"
      title="Blog post not found"
      error={error}
    />
  )
}
