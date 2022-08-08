import { useLoaderData } from "@remix-run/react"
import type { LoaderFunction, MetaFunction } from "@remix-run/server-runtime"
import { json } from "@remix-run/server-runtime"

import type { AboutInfo } from "@gs/about"
import AboutHero from "@gs/about/AboutHero"
import { getAboutInfo } from "@gs/about/service.server"
import { createMetaTitle } from "@gs/helpers/meta"
import { ModelName } from "@gs/models"
import { getCareerSummaryItems } from "@gs/models/career.server"
import { getEducationSummaryItems } from "@gs/models/education.server"
// import type { TocItem } from "@gs/helpers/table-of-contents"
// import { createLifeline, createTocFromLifeline } from "@gs/lifeline/helpers"
import { getAuthUser } from "@gs/service/auth.server"
import { type SummaryItem, filterSortSummaryItems } from "@gs/summary"
import SummaryTimeline from "@gs/summary/SummaryTimeline"

interface LoaderData {
  isAuthenticated: boolean
  aboutInfo: AboutInfo
  items: SummaryItem[]
  // lifeline: LifeLineItems
  // lifelineToc: TocItem[]
  // lifelineTags: string[]
  // lifelineSelectedTags: string[]
  // lifelineSelectedCategory: LifeLineCategory
}

export const loader: LoaderFunction = async ({ request }) => {
  const { searchParams } = new URL(request.url)

  const isAuthenticated = Boolean(await getAuthUser(request))

  const [aboutInfo, careerList, educationList] = await Promise.all([
    getAboutInfo(),
    getCareerSummaryItems(),
    getEducationSummaryItems(),
  ])

  const lifelineSelectedCategory = (searchParams.get("category")?.toString() ??
    "") as ModelName

  const summaryItems =
    lifelineSelectedCategory === ModelName.Education
      ? educationList
      : lifelineSelectedCategory === ModelName.Career
      ? careerList
      : [...careerList, ...educationList]

  const items = filterSortSummaryItems(summaryItems)

  // const lifelineSelectedTags = parseGetAllSearchParams(searchParams, "tags")
  // const lifelineTags = generateTagListFromExperienceProps(items)

  // const lifeline = createLifeline(items, lifelineSelectedTags)
  // const lifelineToc = createTocFromLifeline(lifeline)

  return json<LoaderData>({
    isAuthenticated,
    aboutInfo,
    items,
    // lifeline,
    // lifelineToc,
    // lifelineTags,
    // lifelineSelectedTags,
    // lifelineSelectedCategory,
  })
}

export const meta: MetaFunction = () => ({ title: createMetaTitle("About") })

export default function About(): JSX.Element {
  const { items } = useLoaderData<LoaderData>()

  return (
    <>
      <AboutHero />

      <SummaryTimeline items={items} />
      {/* 
      <Lifeline
        lifeline={lifeline}
        toc={lifelineToc}
        tags={lifelineTags}
        selectedTags={lifelineSelectedTags}
        selectedCategory={lifelineSelectedCategory}
        enableEditButton={isAuthenticated}
      /> */}
    </>
  )
}
