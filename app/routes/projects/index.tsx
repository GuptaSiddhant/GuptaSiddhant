import { useLoaderData } from "@remix-run/react"
import { type LoaderFunction, json } from "@remix-run/server-runtime"

import ProjectCard from "~/features/projects/ProjectCard"
import { getProjectList } from "~/features/projects/service.server"
import Section from "~/packages/components/Section"
import { H1 } from "~/packages/components/Text"
import {
  getUniqueTagsFromTeaserProps,
  sortTeasersByDateOldestFirst,
  sortTeasersByFeatured,
} from "~/packages/helpers/teaser"
import type { TeaserProps } from "~/packages/types"
import FilterSortForm from "~/packages/ui/FilterSortForm"

interface LoaderData {
  projects: TeaserProps[]
  tags: { value: string; occurrence: number }[]
  selectedTag?: string
  viewAs?: "grid" | "list"
  sortBy?: "latest" | "oldest" | "featured"
}

export const loader: LoaderFunction = async ({ request }) => {
  const projects = await getProjectList(100)
  const tags = getUniqueTagsFromTeaserProps(projects)

  const { searchParams } = new URL(request.url)
  const selectedTag = searchParams.get("tag") ?? undefined
  const viewAs = (searchParams.get("view") ?? "grid") as LoaderData["viewAs"]
  const sortBy = (searchParams.get("sort") || "latest") as LoaderData["sortBy"]

  const sortPredicate =
    sortBy === "oldest"
      ? sortTeasersByDateOldestFirst
      : sortBy === "featured"
      ? sortTeasersByFeatured
      : undefined

  const filteredProjects = selectedTag
    ? projects.filter((project) => {
        return project.tags
          ?.map((tag) => tag.toLowerCase())
          .includes(selectedTag.toLowerCase())
      })
    : projects
  const sortedProjects = sortPredicate
    ? filteredProjects.sort(sortPredicate)
    : filteredProjects

  return json<LoaderData>({
    projects: sortedProjects,
    tags,
    sortBy,
    viewAs,
    selectedTag,
  })
}

// export const meta: MetaFunction = () => ({
//   title: createMetaTitle("Projects"),
// })

export default function Projects(): JSX.Element {
  const { projects, tags, sortBy, selectedTag, viewAs } =
    useLoaderData<LoaderData>()

  return (
    <>
      <Section.Hero>
        <div className="flex flex-col gap-4">
          <H1>Projects</H1>
          <p className="text-secondary">
            I have been busy over the years, trying different things. Some are
            big, some are small and some are unfinished. Nonetheless, I am proud
            of each one of them.
          </p>
        </div>
        <FilterSortForm
          sortBy={sortBy}
          viewAs={viewAs}
          tags={tags}
          selectedTag={selectedTag}
        />
      </Section.Hero>

      {viewAs === "list" ? (
        <TeaserList teasers={projects} />
      ) : (
        <TeaserGrid teasers={projects} />
      )}

      {/* {filteredProjects.length > 0 ? (
      ) : (
        <Filter.Error handleClear={() => projectsFilterFetcher.submit(null)}>
          No projects found with the given filters.
        </Filter.Error>
      )} */}
    </>
  )
}

function TeaserGrid({ teasers }: { teasers: TeaserProps[] }) {
  return (
    <Section id="projects" className="!p-10">
      <div className="grid grid-flow-row-dense auto-rows-fr grid-cols-1 gap-10 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 min-h-[400px]">
        {teasers.map((teaser) => (
          <ProjectCard
            key={teaser.id}
            project={teaser}
            className={teaser.featured ? "md:col-span-2" : "aspect-square"}
          />
        ))}
      </div>
    </Section>
  )
}

function TeaserList({ teasers }: { teasers: TeaserProps[] }) {
  return (
    <Section.Prose>
      <div className="flex flex-col gap-10">
        {teasers.map((teaser) => (
          <ProjectCard key={teaser.id} project={teaser} className={"h-80"} />
        ))}
      </div>
    </Section.Prose>
  )
}
