import { type LoaderFunction, json } from "@remix-run/server-runtime"

import { getAboutInfo, getSkills } from "~/features/about/service.server"
import {
  getBlogPostDetails,
  getBlogPostTeaserList,
} from "~/features/blog/service.server"
import {
  getCareerItem,
  getCareerList,
  getEducationItem,
  getEducationList,
} from "~/features/experiences/service.server"
import {
  getProjectDetails,
  getProjectTeaserList,
} from "~/features/projects/service.server"

const apiTypes: Record<
  string,
  {
    queryAll: () => Promise<any>
    queryById?: (id: string) => Promise<any>
    linkPath?: string
  }
> = {
  about: { queryAll: getAboutInfo },
  skills: { queryAll: getSkills, linkPath: "about" },
  projects: {
    queryAll: getProjectTeaserList,
    queryById: getProjectDetails,
  },
  blog: {
    queryAll: getBlogPostTeaserList,
    queryById: getBlogPostDetails,
  },
  education: {
    queryAll: getEducationList,
    queryById: getEducationItem,
    linkPath: "about",
  },
  career: {
    queryAll: getCareerList,
    queryById: getCareerItem,
    linkPath: "about",
  },
}

export const loader: LoaderFunction = async ({ request }) => {
  const { searchParams, origin } = new URL(request.url)

  const supportedType = Object.keys(apiTypes)
  const type = searchParams.get("type")?.toString()
  if (!type)
    return json(
      `type param is required. Should be one of ${supportedType}.`,
      400,
    )
  if (!supportedType.includes(type))
    return json(
      `type param '${type}' is not supported. Should be one of ${supportedType}.`,
      400,
    )

  const id = searchParams.get("id")?.toString()

  const { queryAll, queryById, linkPath = type } = apiTypes[type]

  const buildLink = (id?: string) => [origin, linkPath, id].join("/")

  try {
    if (id && queryById) {
      const data = await queryById(id)
      return json({ ...data, linkUrl: buildLink(id) })
    }

    const data = await queryAll()
    const dataWithLink = Array.isArray(data)
      ? data.map((item) => ({
          ...item,
          linkUrl: buildLink(item.id),
        }))
      : { ...data, linkUrl: buildLink(data.id) }

    return json(dataWithLink)
  } catch {
    return json(
      `Could not find data matching query of type: '${type}' ${
        id ? `and id: '${id}'.` : ""
      }`,
      404,
    )
  }
}

export function CatchBoundary() {}
