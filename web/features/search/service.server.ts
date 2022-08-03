import { getAboutInfo, getAboutSkills } from "@gs/about/service.server"
import { getBlogSummaryItems } from "@gs/models/blog.server"
import { getCareerSummaryItems } from "@gs/models/career.server"
import { getEducationSummaryItems } from "@gs/models/education.server"
import { getProjectsSummaryItems } from "@gs/models/projects.server"

const apiTypes: Record<
  string,
  {
    queryAll: () => Promise<any>
    queryById?: (id: string) => Promise<any>
  }
> = {
  about: { queryAll: getAboutInfo },
  skills: { queryAll: getAboutSkills },
  projects: { queryAll: getProjectsSummaryItems },
  blog: { queryAll: getBlogSummaryItems },
  education: {
    queryAll: getEducationSummaryItems,
  },
  career: {
    queryAll: getCareerSummaryItems,
  },
}

export async function search(query?: string, origin?: string) {
  const dataKeys = Object.keys(apiTypes).filter(
    (k) => k !== "about" && k !== "skills",
  )

  for (const key of dataKeys) {
    if (key === query) {
      const data: any[] = await apiTypes[key].queryAll()
      const enrichedData = data.map((item) =>
        generateLinkUrlBuilder(origin, key)(item),
      )

      return { [key]: enrichedData }
    }
  }

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
      const enrichDataWithLinkUrl = generateLinkUrlBuilder(origin, key)
      const filteredData = data
        .filter((item) =>
          query
            ? key.includes(query.toLowerCase()) ||
              filterResultItemByQuery(item, query.toLowerCase())
            : true,
        )
        .map((item) => enrichDataWithLinkUrl(item))
        .slice(0, query ? 5 : 3)

      return results.set(key, filteredData)
    }
  })

  return Object.fromEntries(results.entries())
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

function generateLinkUrlBuilder(origin?: string, linkPath?: string) {
  return function <T extends { id?: string }>(data: T, id?: string) {
    return {
      ...data,
      linkUrl: [origin, linkPath, data.id || id].filter(Boolean).join("/"),
    }
  }
}
