import { useLoaderData } from "@remix-run/react"
import type { LoaderFunction } from "@remix-run/server-runtime"
import { json } from "@remix-run/server-runtime"

import type { AboutInfo } from "~/features/about"
import AboutHero from "~/features/about/AboutHero"
import { getAboutInfo } from "~/features/about/service.server"
import { generateTagListFromExperienceProps } from "~/features/experiences/helpers"
import { getExperienceList } from "~/features/experiences/service.server"
import { parseGetAllSearchParams } from "~/features/helpers/request"
import type { TocItem } from "~/features/helpers/table-of-contents"
import { type LifeLineItems, LifeLineCategory } from "~/features/lifeline"
import {
  createLifeline,
  createTocFromLifeline,
} from "~/features/lifeline/helpers"
import Lifeline from "~/features/lifeline/Lifeline"

interface LoaderData {
  aboutInfo: AboutInfo
  lifeline: LifeLineItems
  lifelineToc: TocItem[]
  lifelineTags: string[]
  lifelineSelectedTags: string[]

  lifelineSelectedCategory: LifeLineCategory
}

export const loader: LoaderFunction = async ({ request }) => {
  const { searchParams } = new URL(request.url)

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
    aboutInfo,
    lifeline,
    lifelineToc,
    lifelineTags,
    lifelineSelectedTags,
    lifelineSelectedCategory,
  })
}

export default function About(): JSX.Element {
  const {
    lifeline,
    lifelineToc,
    lifelineTags,
    lifelineSelectedTags,
    lifelineSelectedCategory,
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
      />
    </>
  )
}
