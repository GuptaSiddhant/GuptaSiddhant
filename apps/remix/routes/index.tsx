import { type AboutInfo } from "@features/about"
import { getAboutInfo } from "@features/about/service.server"
import { getBlogPostTeaserList } from "@features/blog/service.server"
import HomeHeroSection from "@features/home/HomeHeroSection"
import HomeTeaserCarousel from "@features/home/HomeTeaserCarousel"
import { getProjectTeaserList } from "@features/projects/service.server"
import { type TeaserProps } from "@features/teaser"
import { ErrorSection } from "@features/ui/Error"
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
