import { useLoaderData } from "@remix-run/react"
import type { LoaderFunction } from "@remix-run/server-runtime"
import { json } from "@remix-run/server-runtime"

import { type AboutInfo } from "~/packages/about"
import { getAboutInfo } from "~/packages/about/service.server"
import { getBlogPostTeaserList } from "~/packages/blog/service.server"
import HomeHeroSection from "~/packages/home/HomeHeroSection"
import { getProjectTeaserList } from "~/packages/projects/service.server"
import { type TeaserProps } from "~/packages/teaser"
import TeaserCarousel from "~/packages/teaser/TeaserCarousel"
import { ErrorSection } from "~/packages/ui/Error"
import { HeroHeaderCaption } from "~/packages/ui/Hero/HeroHeader"
import { InternalLink } from "~/packages/ui/Link"
import { H2 } from "~/packages/ui/Text"

interface LoaderData {
  about: AboutInfo
  projects: TeaserProps[]
  blogPosts: TeaserProps[]
}

export const loader: LoaderFunction = async () => {
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
        className="bg-gradient-to-b from-gray-900 to-gray-800"
      >
        <HeroHeaderCaption
          caption={{
            label: "Featured Projects",
            to: `#${projectsId}`,
            icon: "hash",
          }}
        />
        <H2 className="!p-0">Stuff I've been tinkering with</H2>
        <InternalLink to={`/${projectsId}/`}>View all projects</InternalLink>
      </TeaserCarousel>

      <TeaserCarousel
        id={blogId}
        teasers={blogPosts}
        linkBaseUrl={`/${blogId}/`}
        className="bg-gradient-to-t from-gray-900 to-gray-800"
      >
        <HeroHeaderCaption
          caption={{
            label: "Recent posts",
            to: `#${blogId}`,
            icon: "hash",
          }}
        />
        <H2 className="!p-0">Recent thoughts and ideas...</H2>
        <InternalLink to={`/${blogId}/`}>View all blog posts</InternalLink>
      </TeaserCarousel>
    </>
  )
}

export function ErrorBoundary({ error }: { error: Error }) {
  return <ErrorSection message={error.message} />
}
