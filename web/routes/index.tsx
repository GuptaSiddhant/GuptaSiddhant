import { type AboutInfo } from "@gs/about"
import { getAboutInfo } from "@gs/about/service.server"
import { getBlogPostTeaserList } from "@gs/blog/service.server"
import HomeHeroSection from "@gs/home/HomeHeroSection"
import HomeTeaserCarousel from "@gs/home/HomeTeaserCarousel"
import { getProjectTeaserList } from "@gs/projects/service.server"
import { type TeaserProps } from "@gs/teaser"
import { ErrorSection } from "@gs/ui/Error"
import { useLoaderData } from "@remix-run/react"
import type {
  ErrorBoundaryComponent,
  LoaderFunction,
} from "@remix-run/server-runtime"
import { json } from "@remix-run/server-runtime"
import ProjectIcon from "remixicon-react/ArtboardFillIcon"
import BlogIcon from "remixicon-react/QuillPenFillIcon"

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

  return (
    <>
      <HomeHeroSection {...about} />

      <HomeTeaserCarousel
        id="projects"
        linkText="See all projects"
        caption="Featured Projects"
        teasers={projects}
        icon={<ProjectIcon />}
      >
        Stuff I've been tinkering with
      </HomeTeaserCarousel>

      <HomeTeaserCarousel
        id="blog"
        linkText="See all blog posts"
        caption="Recent posts"
        teasers={blogPosts}
        icon={<BlogIcon />}
      >
        Recent thoughts and ideas...
      </HomeTeaserCarousel>
    </>
  )
}

export const ErrorBoundary: ErrorBoundaryComponent = ({ error }) => {
  return <ErrorSection error={error} />
}
