import { InternalLink } from "@gs/components/Link"
import { Caption, H2 } from "@gs/components/Text"
import {
  getFirestoreDocument,
  FirestoreCollection,
} from "@gs/service/firestore.server"
import TeaserSection from "@gs/layouts/TeaserSection"
import { Link, useLoaderData } from "@remix-run/react"

import { json } from "@remix-run/server-runtime"
import { fetchBlogPostList } from "~/features/blog/service"
import { type HomeLoaderData, type About } from "~/features/home"
import HomeHeroSection from "~/features/home/HomeHeroSection"
import { getProjectList } from "~/features/projects/service"

export async function loader() {
  const about = await getFirestoreDocument<About>(
    FirestoreCollection.Info,
    "about",
  )
  if (!about) {
    throw new Error("No about info found")
  }
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
