import { Link, useLoaderData } from "@remix-run/react"
import { json } from "@remix-run/server-runtime"

import { type AboutInfo } from "~/features/about"
import { getAboutInfo } from "~/features/about/service.server"
import { getBlogPostTeaserList } from "~/features/blog/service.server"
import HomeHeroSection from "~/features/home/HomeHeroSection"
import { getProjectTeaserList } from "~/features/projects/service.server"
import { ErrorSection } from "~/packages/components/Error"
import { InternalLink } from "~/packages/components/Link"
import { Caption, H2 } from "~/packages/components/Text"
import { type TeaserProps } from "~/packages/teaser"
import TeaserCarousel from "~/packages/teaser/TeaserCarousel"

interface LoaderData {
  about: AboutInfo
  projects: TeaserProps[]
  blogPosts: TeaserProps[]
}

export async function loader() {
  const [about, projects, blogPosts] = await Promise.all([
    getAboutInfo(),
    getProjectTeaserList(6),
    getBlogPostTeaserList(6),
  ])

  return json<LoaderData>({ about, projects, blogPosts })
}

export default function Index() {
  const { about, projects, blogPosts } = useLoaderData<LoaderData>()
  const projectsId = "projects"
  const blogId = "blog"

  return (
    <>
      <HomeHeroSection {...about} />

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
