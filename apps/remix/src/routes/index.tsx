import { useLoaderData } from "@remix-run/react";
import type { ErrorBoundaryComponent } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";

import HomeHeroSection from "@gs/home/HomeHeroSection";
import HomeSummarySlider from "@gs/home/HomeSummarySlider";
import { type AboutInfo, getAboutInfo } from "@gs/models/about/index.server";
import { BlogIcon } from "@gs/models/blog";
import { getBlogSummaryItems } from "@gs/models/blog/index.server";
import { CareerIcon } from "@gs/models/career";
import {
  type CareerProps,
  getCareerItem,
  getCareerSummaryItems,
} from "@gs/models/career/index.server";
import { EducationIcon } from "@gs/models/education";
import { getEducationSummaryItems } from "@gs/models/education/index.server";
import { ProjectsIcon } from "@gs/models/projects";
import { getProjectsSummaryItems } from "@gs/models/projects/index.server";
import type { SummaryItem } from "@gs/summary";
import { ErrorSection } from "@gs/ui/Error";

interface LoaderData {
  about: AboutInfo;
  projects: SummaryItem[];
  blogPosts: SummaryItem[];
  career: SummaryItem[];
  education: SummaryItem[];
  currentCompany?: CareerProps;
}

export async function loader() {
  const limit = 6;
  const [about, projects, blogPosts, career, education] = await Promise.all([
    getAboutInfo(),
    getProjectsSummaryItems(),
    getBlogSummaryItems(),
    getCareerSummaryItems(),
    getEducationSummaryItems(),
  ]);
  const currentCompany = about.currentCompany
    ? await getCareerItem(about.currentCompany)
    : undefined;

  return json<LoaderData>({
    about,
    currentCompany,
    projects: projects.slice(0, limit),
    blogPosts: blogPosts.slice(0, limit),
    career: career.slice(0, limit),
    education: education.slice(0, limit),
  });
}

export default function Index() {
  const { about, currentCompany, projects, blogPosts, career, education } =
    useLoaderData<LoaderData>();

  return (
    <>
      <HomeHeroSection about={about} currentCompany={currentCompany} />

      <HomeSummarySlider
        id="projects"
        linkText="See all projects"
        caption="Featured Projects"
        items={projects}
        icon={<ProjectsIcon />}
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

      <HomeSummarySlider
        id="career"
        linkText="See all career"
        caption="Career"
        items={career}
        icon={<CareerIcon />}
        showCardSubtitle
      >
        Work, work, work...
      </HomeSummarySlider>

      <HomeSummarySlider
        id="education"
        linkText="See all education"
        caption="Education"
        items={education}
        icon={<EducationIcon />}
        showCardSubtitle
      >
        Student of the life..
      </HomeSummarySlider>
    </>
  );
}

export const ErrorBoundary: ErrorBoundaryComponent = ({ error }) => {
  return <ErrorSection error={error} />;
};
