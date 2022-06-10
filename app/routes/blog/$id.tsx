import { useLoaderData } from "@remix-run/react"
import { type LoaderFunction, json } from "@remix-run/server-runtime"
import clsx from "clsx"

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
  const { title, subtitle, description, gallery } = post
  const cover: string | undefined = gallery?.[0]?.url

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

      <figure
        className={clsx(
          "relative",
          "-w-full-m4 mx-4 md:-w-full-m8 md:mx-8",
          "md:aspect-video",
        )}
      >
        <img
          src={cover}
          alt={title}
          className="object-cover h-full w-full min-h-[50vh] rounded-md"
          loading="eager"
        />
        {/* <figcaption className="text-tertiary text-sm py-2">{title}</figcaption> */}
      </figure>
    </>
  )
}

export function ErrorBoundary({ error }: { error: Error }) {
  return <ErrorSection title="Blog post not found" message={error.message} />
}
