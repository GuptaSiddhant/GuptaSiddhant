import { InternalLink } from "@gs/components/Link"
import { Caption, H2 } from "@gs/components/Text"
import TeaserSection from "@gs/components/TeaserSection"
import { Link, useLoaderData } from "@remix-run/react"

import { json } from "@remix-run/server-runtime"
import { fetchBlogPostList } from "~/features/blog/service.server"
import { type HomeLoaderData } from "~/features/home"
import HomeHeroSection from "~/features/home/HomeHeroSection"
import { getProjectList } from "~/features/projects/service.server"
import { getAboutInfo } from "~/features/home/service.server"

export async function loader() {
  const about = await getAboutInfo()
  const projects = await getProjectList(6)
  const blogPosts = await fetchBlogPostList(6)

  return json<HomeLoaderData>({ about, projects, blogPosts })
}

export default function Index() {
  const { projects, blogPosts } = useLoaderData<HomeLoaderData>()

  return (
    <>
      <HomeHeroSection />

      <TeaserSection items={projects} linkBaseUrl="/projects/">
        <Caption>
          <Link to={"#projects"}>Projects</Link>
        </Caption>
        <H2 className="!p-0">Stuff I've been tinkering with</H2>
        <InternalLink to="/projects">View all projects</InternalLink>
      </TeaserSection>

      <TeaserSection items={blogPosts} linkBaseUrl="/blog/">
        <Caption>
          <Link to={"#blog"}>Recent posts</Link>
        </Caption>
        <H2 className="!p-0">Recent thoughts and ideas...</H2>
        <InternalLink to="/blog">View all blog posts</InternalLink>
      </TeaserSection>
    </>
  )
}
