import { useLoaderData } from "@remix-run/react"
import {
  type LoaderFunction,
  type MetaFunction,
  json,
} from "@remix-run/server-runtime"

import { type BlogPostProps, generateBlogPostMeta } from "~/features/blog"
import { getBlogPostDetails } from "~/features/blog/service.server"
import { ErrorSection } from "~/packages/components/Error"
import Hero from "~/packages/components/Hero"
import ShareTray from "~/packages/components/ShareTray"
import Tags from "~/packages/components/Tags"

interface LoaderData {
  post: BlogPostProps
  url: string
}

export const loader: LoaderFunction = async ({ params, request }) => {
  const id = params.id
  if (!id) throw new Error("Blog post id is required")

  try {
    const post = await getBlogPostDetails(id)

    return json<LoaderData>({ post, url: request.url })
  } catch (e: any) {
    const reason = __IS_DEV__ ? `Reason: ${e?.message}` : ""
    throw new Error(`Failed to load blog post '${id}'. ${reason}`)
  }
}

export const meta: MetaFunction = ({ data, params }) =>
  generateBlogPostMeta(data?.post, data?.url, params.id)

export default function ProjectDetails(): JSX.Element {
  const { post, url } = useLoaderData<LoaderData>()
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
        >
          <ShareTray url={url} />
        </Hero.Header>

        <Hero.Description description={description}>
          <Tags.List tags={tags.sort()} className="justify-start" />
        </Hero.Description>

        <Hero.Image src={cover} alt={title} icon={icon} />
      </Hero>
    </>
  )
}

export function ErrorBoundary({ error }: { error: Error }) {
  return <ErrorSection title="Blog post not found" message={error.message} />
}
