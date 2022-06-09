import { Link, useLoaderData } from "@remix-run/react"
import { json } from "@remix-run/server-runtime"

import { fetchBlogPostList } from "~/features/blog/service.server"
import { type HomeLoaderData } from "~/features/home"
import HomeHeroSection from "~/features/home/HomeHeroSection"
import { getAboutInfo } from "~/features/home/service.server"
import { getProjectList } from "~/features/projects/service.server"
import { InternalLink } from "~/packages/components/Link"
import { Caption, H2 } from "~/packages/components/Text"
import TeaserSection from "~/packages/ui/TeaserSection"

export async function loader() {
  const about = await getAboutInfo()
  const projects = await getProjectList(6)
  const blogPosts = await fetchBlogPostList(6)

  return json<HomeLoaderData>({ about, projects, blogPosts })
}

export default function Index() {
  const { projects, blogPosts } = useLoaderData<HomeLoaderData>()
  const projectsId = "projects"
  const blogId = "blog"

  return (
    <>
      <HomeHeroSection />

      <TeaserSection
        id={projectsId}
        items={projects}
        linkBaseUrl={`/${projectsId}/`}
        className="bg-gradient-to-t from-gray-900 to-gray-800"
      >
        <Caption>
          <Link to={"#" + projectsId}>Projects</Link>
        </Caption>
        <H2 className="!p-0">Stuff I've been tinkering with</H2>
        <InternalLink to={`/${projectsId}/`}>View all projects</InternalLink>
      </TeaserSection>

      <TeaserSection id={blogId} items={blogPosts} linkBaseUrl={`/${blogId}/`}>
        <Caption>
          <Link to={"#" + blogId}>Recent posts</Link>
        </Caption>
        <H2 className="!p-0">Recent thoughts and ideas...</H2>
        <InternalLink to={`/${blogId}/`}>View all blog posts</InternalLink>
      </TeaserSection>
    </>
  )
}
