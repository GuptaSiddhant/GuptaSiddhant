import type { AboutInfo } from "@gs/about"
import AboutHero from "@gs/about/AboutHero"
import { getAboutInfo } from "@gs/about/service.server"
import { generateTagListFromExperienceProps } from "@gs/experiences/helpers"
import { getExperienceList } from "@gs/experiences/service.server"
import { parseGetAllSearchParams } from "@gs/helpers/request"
import type { TocItem } from "@gs/helpers/table-of-contents"
import { type LifeLineItems, LifeLineCategory } from "@gs/lifeline"
import { createLifeline, createTocFromLifeline } from "@gs/lifeline/helpers"
import Lifeline from "@gs/lifeline/Lifeline"
import { useLoaderData } from "@remix-run/react"
import type { LoaderFunction, MetaFunction } from "@remix-run/server-runtime"
import { json } from "@remix-run/server-runtime"

import { createMetaTitle } from "~/features/helpers/meta"
import { getAuthUser } from "~/features/service/auth.server"

interface LoaderData {
  isAuthenticated: boolean
  aboutInfo: AboutInfo
  lifeline: LifeLineItems
  lifelineToc: TocItem[]
  lifelineTags: string[]
  lifelineSelectedTags: string[]
  lifelineSelectedCategory: LifeLineCategory
}

export const loader: LoaderFunction = async ({ request }) => {
  const { searchParams } = new URL(request.url)

  const isAuthenticated = Boolean(await getAuthUser(request))

  const [aboutInfo, experienceList] = await Promise.all([
    getAboutInfo(),
    getExperienceList(),
  ])

  const lifelineSelectedCategory = (searchParams.get("category")?.toString() ||
    LifeLineCategory.All) as LifeLineCategory

  const items =
    lifelineSelectedCategory === LifeLineCategory.Education
      ? experienceList.filter(({ category }) => category === "education")
      : lifelineSelectedCategory === LifeLineCategory.Career
      ? experienceList.filter(({ category }) => category === "career")
      : experienceList

  const lifelineSelectedTags = parseGetAllSearchParams(searchParams, "tags")
  const lifelineTags = generateTagListFromExperienceProps(items)

  const lifeline = createLifeline(items, lifelineSelectedTags)
  const lifelineToc = createTocFromLifeline(lifeline)

  return json<LoaderData>({
    isAuthenticated,
    aboutInfo,
    lifeline,
    lifelineToc,
    lifelineTags,
    lifelineSelectedTags,
    lifelineSelectedCategory,
  })
}

export const meta: MetaFunction = () => ({ title: createMetaTitle("About") })

export default function About(): JSX.Element {
  const {
    lifeline,
    lifelineToc,
    lifelineTags,
    lifelineSelectedTags,
    lifelineSelectedCategory,
    isAuthenticated,
  } = useLoaderData<LoaderData>()

  return (
    <>
      <AboutHero />

      <Lifeline
        lifeline={lifeline}
        toc={lifelineToc}
        tags={lifelineTags}
        selectedTags={lifelineSelectedTags}
        selectedCategory={lifelineSelectedCategory}
        enableEditButton={isAuthenticated}
      />
    </>
  )
}
