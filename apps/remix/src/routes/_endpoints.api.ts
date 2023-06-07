import { type DataFunctionArgs, json } from "@remix-run/server-runtime";

import { getAboutInfo, getAboutSkills } from "@gs/models/about.server";
import { getBlogPost, getBlogSummaryItems } from "@gs/models/blog.server";
import { getCareerItem, getCareerSummaryItems } from "@gs/models/career.server";
import {
  getEducationItem,
  getEducationSummaryItems,
} from "@gs/models/education.server";
import {
  getProject,
  getProjectsSummaryItems,
} from "@gs/models/projects.server";

const apiTypes: Record<
  string,
  {
    query?: () => Promise<unknown>;
    queryAll?: () => Promise<Array<{ id?: string }>>;
    queryById?: (id: string) => Promise<{ id?: string }>;
    linkPath?: string;
  }
> = {
  about: { query: getAboutInfo },
  skills: { query: getAboutSkills, linkPath: "about" },
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
};

const supportedTypes = Object.keys(apiTypes);

export async function loader({ request }: DataFunctionArgs) {
  const { searchParams, origin } = new URL(request.url);
  const type = searchParams.get("type")?.toString();
  const id = searchParams.get("id")?.toString();

  if (!type) {
    return json(
      `type param is required. Should be one of ${supportedTypes}.`,
      400,
    );
  }

  if (!supportedTypes.includes(type)) {
    return json(
      `type param '${type}' is not supported. Should be one of ${supportedTypes}.`,
      400,
    );
  }

  try {
    const { query, queryAll, queryById, linkPath = type } = apiTypes[type];
    const enrichDataWithLinkUrl = generateLinkUrlBuilder(origin, linkPath);

    if (id && queryById) {
      const data = await queryById(id);

      return json(enrichDataWithLinkUrl(data, id));
    }

    if (queryAll) {
      const data = await queryAll();
      const dataWithLink = data.map((item) => enrichDataWithLinkUrl(item));

      return json(dataWithLink);
    }

    if (query) {
      const data = enrichDataWithLinkUrl((await query()) || {});

      return json(data);
    }

    throw new Error("Method to query data does not exist.");
  } catch {
    return json(
      `Could not find data for type: '${type}' ${id ? `and id: '${id}'.` : ""}`,
      404,
    );
  }
}

export function CatchBoundary() {}

function generateLinkUrlBuilder(origin?: string, linkPath?: string) {
  return function <T extends { id?: string }>(data: T, id?: string) {
    return {
      ...data,
      linkUrl: [origin, linkPath, data.id || id].filter(Boolean).join("/"),
    };
  };
}
