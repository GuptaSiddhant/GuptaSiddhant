import { useLoaderData } from "@remix-run/react"
import type { LoaderFunction } from "@remix-run/server-runtime"
import { json } from "@remix-run/server-runtime"

import type { AboutInfo, CareerProps, EducationProps } from "~/features/about"
import AboutHero from "~/features/about/AboutHero"
import {
  getAboutInfo,
  getCareerList,
  getEducationList,
} from "~/features/about/service.server"
import { type LifeLineItems } from "~/features/lifeline"
import { createLifeline } from "~/features/lifeline/helpers"
import Lifeline from "~/features/lifeline/Lifeline"

interface LoaderData {
  aboutInfo: AboutInfo
  lifeline: LifeLineItems
}

export const loader: LoaderFunction = async () => {
  const [aboutInfo, careerList, educationList] = await Promise.all([
    getAboutInfo(),
    getCareerList(),
    getEducationList(),
  ])

  const lifeline = createLifeline([...careerList, ...educationList])

  return json<LoaderData>({ aboutInfo, lifeline })
}

export default function About(): JSX.Element {
  const { lifeline } = useLoaderData<LoaderData>()

  return (
    <>
      <AboutHero />
      <Lifeline lifeline={lifeline} />
    </>
  )
}
