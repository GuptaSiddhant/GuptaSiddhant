import ProjectIcon from "remixicon-react/ArtboardFillIcon"
import BlogIcon from "remixicon-react/QuillPenFillIcon"

import { useLoaderData } from "@remix-run/react"
import type {
  ErrorBoundaryComponent,
  LoaderFunction,
} from "@remix-run/server-runtime"
import { json } from "@remix-run/server-runtime"

import HomeHeroSection from "@gs/home/HomeHeroSection"
import HomeSummarySlider from "@gs/home/HomeSummarySlider"
import { type AboutInfo, getAboutInfo } from "@gs/models/about/index.server"
import { getBlogSummaryItems } from "@gs/models/blog/index.server"
import { type CareerProps, getCareerItem } from "@gs/models/career/index.server"
import { getProjectsSummaryItems } from "@gs/models/projects/index.server"
import type { SummaryItem } from "@gs/summary"
import { ErrorSection } from "@gs/ui/Error"

interface LoaderData {
  about: AboutInfo
  projects: SummaryItem[]
  blogPosts: SummaryItem[]
  currentCompany?: CareerProps
}

export const loader: LoaderFunction = async () => {
  const [about, projects, blogPosts] = await Promise.all([
    getAboutInfo(),
    getProjectsSummaryItems(),
    getBlogSummaryItems(),
  ])
  const currentCompany = about.currentCompany
    ? await getCareerItem(about.currentCompany)
    : undefined

  return json<LoaderData>({
    about,
    currentCompany,
    projects: projects.slice(0, 6),
    blogPosts,
  })
}

export default function Index() {
  const { about, currentCompany, projects, blogPosts } =
    useLoaderData<LoaderData>()

  return (
    <>
      <HomeHeroSection about={about} currentCompany={currentCompany} />

      <HomeSummarySlider
        id="projects"
        linkText="See all projects"
        caption="Featured Projects"
        items={projects}
        icon={<ProjectIcon />}
      >
        Stuff I've been tinkering with
      </HomeSummarySlider>

      <HomeSummarySlider
        id="blog"
        linkText="See all blog posts"
        caption="Recent posts"
        items={blogPosts}
        icon={<BlogIcon />}
      >
        Recent thoughts and ideas...
      </HomeSummarySlider>
    </>
  )
}

export const ErrorBoundary: ErrorBoundaryComponent = ({ error }) => {
  return <ErrorSection error={error} />
}
