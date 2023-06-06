import { useLoaderData, useRouteError } from "@remix-run/react";
import { defer } from "@remix-run/server-runtime";

import { getAboutInfo } from "@gs/models/about.server";
import { BlogIcon } from "@gs/models/blog.model";
import { getBlogSummaryItems } from "@gs/models/blog.server";
import { CareerIcon } from "@gs/models/career.model";
import { getCareerItem, getCareerSummaryItems } from "@gs/models/career.server";
import { EducationIcon } from "@gs/models/education.model";
import { getEducationSummaryItems } from "@gs/models/education.server";
import { ProjectsIcon } from "@gs/models/projects.model";
import { getProjectsSummaryItems } from "@gs/models/projects.server";
import type { SummaryItem } from "@gs/summary";
import { ErrorSection } from "@gs/ui/Error";

import HomeHeroSection from "./HomeHeroSection";
import HomeSummarySlider from "./HomeSummarySlider";

export async function loader() {
  const limit = 6;
  const about = await getAboutInfo();
  const currentCompany = about.currentCompany
    ? await getCareerItem(about.currentCompany)
    : undefined;

  const itemsModifier = async (items: SummaryItem[]) => items.slice(0, limit);

  const projects = getProjectsSummaryItems().then(itemsModifier);
  const blogPosts = getBlogSummaryItems().then(itemsModifier);
  const career = getCareerSummaryItems().then(itemsModifier);
  const education = getEducationSummaryItems().then(itemsModifier);

  return defer({
    about,
    currentCompany,
    projects,
    blogPosts,
    career,
    education,
  });
}

export default function Index() {
  const { about, currentCompany, projects, blogPosts, career, education } =
    useLoaderData<typeof loader>();

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

export function ErrorBoundary() {
  return <ErrorSection error={useRouteError()} />;
}
