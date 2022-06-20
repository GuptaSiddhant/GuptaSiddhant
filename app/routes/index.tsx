import { useLoaderData } from "@remix-run/react"
import type { LoaderFunction } from "@remix-run/server-runtime"
import { json } from "@remix-run/server-runtime"

import { type AboutInfo } from "~/features/about"
import { getAboutInfo } from "~/features/about/service.server"
import { getBlogPostTeaserList } from "~/features/blog/service.server"
import HomeHeroSection from "~/features/home/HomeHeroSection"
import { getProjectTeaserList } from "~/features/projects/service.server"
import { type TeaserProps } from "~/features/teaser"
import TeaserCarousel from "~/features/teaser/TeaserCarousel"
import { ErrorSection } from "~/features/ui/Error"
import { HeroHeaderCaption } from "~/features/ui/Hero/HeroHeader"
import { InternalLink } from "~/features/ui/Link"
import { H2 } from "~/features/ui/Text"

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
  return <ErrorSection error={error} />
}
