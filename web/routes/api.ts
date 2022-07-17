import { getAboutInfo, getSkills } from "@gs/about/service.server"
import {
  getBlogPostDetails,
  getBlogPostTeaserList,
} from "@gs/blog/service.server"
import {
  getCareerItem,
  getCareerList,
  getEducationItem,
  getEducationList,
} from "@gs/experiences/service.server"
import {
  getProjectDetails,
  getProjectTeaserList,
} from "@gs/projects/service.server"
import { type LoaderFunction, json } from "@remix-run/server-runtime"

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

const supportedTypes = Object.keys(apiTypes)

export const loader: LoaderFunction = async ({ request }) => {
  const { searchParams, origin } = new URL(request.url)
  const type = searchParams.get("type")?.toString()
  const id = searchParams.get("id")?.toString()
  const query = searchParams.get("query")?.toString()

  if (!type) {
    return json(
      `type param is required. Should be one of ${supportedTypes}.`,
      400,
    )
  }

  try {
    if (type === "search") {
      return await search(query, origin)
    }

    return await queryByType(type, id, origin)
  } catch {
    return json(
      `Could not find data for type: '${type}' ${
        id ? `and id: '${id}'.` : query ? `and query: '${query}'.` : ""
      }`,
      404,
    )
  }
}

export function CatchBoundary() {}

/** Search */
async function search(query?: string, origin?: string) {
  const dataKeys = Object.keys(apiTypes).filter(
    (k) => k !== "about" && k !== "skills",
  )
  const allData = await Promise.all(
    dataKeys.map((key) => apiTypes[key].queryAll()),
  )

  const results: Map<string, any> = new Map()
  dataKeys.forEach((key, index) => {
    const data: any = allData[index]
    if (data) {
      if (!Array.isArray(data)) {
        return results.set(key, data)
      }

      // Array of items
      const enrichDataWithLinkUrl = generateLinkUrlBuilder(
        origin,
        apiTypes[key].linkPath || key,
      )
      const filteredData = data
        .filter((item) =>
          query ? filterResultItemByQuery(item, query.toLowerCase()) : false,
        )
        .map((item) => enrichDataWithLinkUrl(item))
        .slice(0, 5)

      return results.set(key, filteredData)
    }
  })

  return json(Object.fromEntries(results.entries()))
}

function filterResultItemByQuery(item: any, query: string): boolean {
  if (!item || typeof item !== "object") return false
  if ("title" in item && typeof item.title === "string") {
    if (item.title.toLowerCase().includes(query)) return true
  }
  if ("subtitle" in item && typeof item.subtitle === "string") {
    if (item.subtitle.toLowerCase().includes(query)) return true
  }
  return false
}

/** Direct query */
async function queryByType(type: string, id?: string, origin?: string) {
  if (!supportedTypes.includes(type)) {
    return json(
      `type param '${type}' is not supported. Should be one of ${supportedTypes}.`,
      400,
    )
  }

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
}

function generateLinkUrlBuilder(origin?: string, linkPath?: string) {
  return function <T extends { id?: string }>(data: T, id?: string) {
    return {
      ...data,
      linkUrl: [origin, linkPath, data.id || id].filter(Boolean).join("/"),
    }
  }
}
