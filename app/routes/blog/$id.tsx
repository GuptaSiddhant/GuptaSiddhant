import { useLoaderData } from "@remix-run/react"
import { type LoaderFunction, json } from "@remix-run/server-runtime"

import { type BlogPostProps } from "~/features/blog"
import { getBlogPostDetails } from "~/features/blog/service.server"
import { ErrorSection } from "~/packages/components/Error"
import Hero from "~/packages/components/Hero"
import { Paragraph } from "~/packages/components/Text"

interface LoaderData {
  post: BlogPostProps
}

export const loader: LoaderFunction = async ({ params }) => {
  const id = params.id
  if (!id) throw new Error("Blog post id is required")

  try {
    const post = await getBlogPostDetails(id)

    return json<LoaderData>({ post })
  } catch (e: any) {
    throw new Error(`Failed to load blog post '${id}'. Reason: ${e?.message}`)
  }
}

export default function ProjectDetails(): JSX.Element {
  const { post } = useLoaderData<LoaderData>()
  const { title, subtitle, description } = post

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
        {description ? (
          <Paragraph className="text-tertiary">{description}</Paragraph>
        ) : null}
      </Hero>
    </>
  )
}

export function ErrorBoundary({ error }: { error: Error }) {
  return <ErrorSection title="Blog post not found" message={error.message} />
}
