import { Link, useLoaderData } from "@remix-run/react"
import { json } from "@remix-run/server-runtime"

import { getBlogPostTeaserList } from "~/features/blog/service.server"
import { type HomeLoaderData } from "~/features/home"
import HomeHeroSection from "~/features/home/HomeHeroSection"
import { getAboutInfo } from "~/features/home/service.server"
import { getProjectTeaserList } from "~/features/projects/service.server"
import { ErrorSection } from "~/packages/components/Error"
import { InternalLink } from "~/packages/components/Link"
import { Caption, H2 } from "~/packages/components/Text"
import TeaserCarousel from "~/packages/teaser/TeaserCarousel"

export async function loader() {
  const about = await getAboutInfo()
  const projects = await getProjectTeaserList(6)
  const blogPosts = await getBlogPostTeaserList(6)

  return json<HomeLoaderData>({ about, projects, blogPosts })
}

export default function Index() {
  const { projects, blogPosts } = useLoaderData<HomeLoaderData>()
  const projectsId = "projects"
  const blogId = "blog"

  return (
    <>
      <HomeHeroSection />

      <TeaserCarousel
        id={projectsId}
        teasers={projects}
        linkBaseUrl={`/${projectsId}/`}
      >
        <Caption>
          <Link to={"#" + projectsId}>Featured Projects</Link>
        </Caption>
        <H2 className="!p-0">Stuff I've been tinkering with</H2>
        <InternalLink to={`/${projectsId}/`}>View all projects</InternalLink>
      </TeaserCarousel>

      <TeaserCarousel
        id={blogId}
        teasers={blogPosts}
        linkBaseUrl={`/${blogId}/`}
      >
        <Caption>
          <Link to={"#" + blogId}>Recent posts</Link>
        </Caption>
        <H2 className="!p-0">Recent thoughts and ideas...</H2>
        <InternalLink to={`/${blogId}/`}>View all blog posts</InternalLink>
      </TeaserCarousel>
    </>
  )
}

export function ErrorBoundary({ error }: { error: Error }) {
  return <ErrorSection message={error.message} />
}
