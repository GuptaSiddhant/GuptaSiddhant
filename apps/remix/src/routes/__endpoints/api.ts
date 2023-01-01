import { type LoaderFunction, json } from "@remix-run/server-runtime"

import { getAboutInfo, getAboutSkills } from "@gs/models/about/index.server"
import { getBlogPost, getBlogSummaryItems } from "@gs/models/blog/index.server"
import {
  getCareerItem,
  getCareerSummaryItems,
} from "@gs/models/career/index.server"
import {
  getEducationItem,
  getEducationSummaryItems,
} from "@gs/models/education/index.server"
import {
  getProject,
  getProjectsSummaryItems,
} from "@gs/models/projects/index.server"

const apiTypes: Record<
  string,
  {
    queryAll: () => Promise<any>
    queryById?: (id: string) => Promise<any>
    linkPath?: string
  }
> = {
  about: { queryAll: getAboutInfo },
  skills: { queryAll: getAboutSkills, linkPath: "about" },
  projects: {
    queryAll: getProjectsSummaryItems,
    queryById: getProject,
  },
  blog: {
    queryAll: getBlogSummaryItems,
    queryById: getBlogPost,
  },
  education: {
    queryAll: getEducationSummaryItems,
    queryById: getEducationItem,
    linkPath: "about",
  },
  career: {
    queryAll: getCareerSummaryItems,
    queryById: getCareerItem,
    linkPath: "about",
  },
}

const supportedTypes = Object.keys(apiTypes)

export const loader: LoaderFunction = async ({ request }) => {
  const { searchParams, origin } = new URL(request.url)
  const type = searchParams.get("type")?.toString()
  const id = searchParams.get("id")?.toString()

  if (!type) {
    return json(
      `type param is required. Should be one of ${supportedTypes}.`,
      400,
    )
  }

  if (!supportedTypes.includes(type)) {
    return json(
      `type param '${type}' is not supported. Should be one of ${supportedTypes}.`,
      400,
    )
  }

  try {
    const { queryAll, queryById, linkPath = type } = apiTypes[type]
    const enrichDataWithLinkUrl = generateLinkUrlBuilder(origin, linkPath)

    if (id && queryById) {
      const data = await queryById(id)
      return json(enrichDataWithLinkUrl(data, id))
    }

    const data = await queryAll()
    const dataWithLink = Array.isArray(data)
      ? data.map((item) => enrichDataWithLinkUrl(item))
      : enrichDataWithLinkUrl(data)

    return json(dataWithLink)
  } catch {
    return json(
      `Could not find data for type: '${type}' ${id ? `and id: '${id}'.` : ""}`,
      404,
    )
  }
}

export function CatchBoundary() {}

function generateLinkUrlBuilder(origin?: string, linkPath?: string) {
  return function <T extends { id?: string }>(data: T, id?: string) {
    return {
      ...data,
      linkUrl: [origin, linkPath, data.id || id].filter(Boolean).join("/"),
    }
  }
}