import { useLoaderData } from "@remix-run/react"
import type { LoaderFunction } from "@remix-run/server-runtime"
import { json } from "@remix-run/server-runtime"

import type { AboutInfo } from "~/features/about"
import AboutHero from "~/features/about/AboutHero"
import {
  getAboutInfo,
  getCareerList,
  getEducationList,
} from "~/features/about/service.server"
import type { TocItem } from "~/features/helpers/table-of-contents"
import { type LifeLineItems } from "~/features/lifeline"
import {
  createLifeline,
  createTocFromLifeline,
} from "~/features/lifeline/helpers"
import Lifeline from "~/features/lifeline/Lifeline"

interface LoaderData {
  aboutInfo: AboutInfo
  lifeline: LifeLineItems
  lifelineToc: TocItem[]
}

export const loader: LoaderFunction = async () => {
  const [aboutInfo, careerList, educationList] = await Promise.all([
    getAboutInfo(),
    getCareerList(),
    getEducationList(),
  ])

  const lifeline = createLifeline([...careerList, ...educationList])
  const lifelineToc = createTocFromLifeline(lifeline)

  return json<LoaderData>({ aboutInfo, lifeline, lifelineToc })
}

export default function About(): JSX.Element {
  const { lifeline, lifelineToc } = useLoaderData<LoaderData>()

  return (
    <>
      <AboutHero />

      <Lifeline lifeline={lifeline} toc={lifelineToc} />
    </>
  )
}
