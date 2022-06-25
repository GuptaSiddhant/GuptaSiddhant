import { renderToString } from "@react-pdf/renderer"

import {
  getAboutInfo,
  getCareerList,
  getEducationList,
} from "~/features/about/service.server"

import { transformAboutLinkToContactLinks } from "./helpers"
import Resume, { type ResumeProps } from "./Resume"

export default async function handler(request: Request): Promise<string> {
  const { link } = await getAboutInfo()
  const careerList = await getCareerList()
  const educationList = await getEducationList()

  const resumeProps: ResumeProps = {
    name: "Siddhant Gupta",
    position: "Full-stack & UI developer",
    contactLinks: transformAboutLinkToContactLinks(link),
    experiences: careerList,
    educations: educationList,
  }

  return renderToString(<Resume {...resumeProps} />)
}
