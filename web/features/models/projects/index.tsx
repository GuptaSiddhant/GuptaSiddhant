import clsx from "clsx";
import ProjectsIcon from "remixicon-react/ArtboardLineIcon";

import type { SummaryItem } from "@gs/summary";
import type { Gallery } from "@gs/types";

import { commonBlogProjectModel } from "../common-models";
import { type ModelObjectType, type ModelStyling, ModelSize } from "../types";
import type { AboutInfo } from "../about/info";
import type { BlogPosting, WithContext } from "schema-dts";

const model: ModelObjectType = {
  type: "object",
  properties: {
    ...commonBlogProjectModel.properties,
    dateStart: { type: "string", required: true },
    dateEnd: { type: "string" },
    association: { type: "string", size: ModelSize.MEDIUM },
  },
};

const styling: ModelStyling = {
  bg: clsx("bg-green-500"),
  text: clsx("text-green-600"),
  border: clsx("border-green-500"),
  borderHocus: clsx("group-hocus:border-green-500 selected:border-green-500"),
  icon: <ProjectsIcon />,
};

export default { model, styling };

export interface ProjectProps extends SummaryItem {
  association?: string;
  dateEnd?: string;
  dateStart: string;
  content?: string;
  gallery?: Gallery;
}

export { ProjectsIcon };

export function generateStructuredDataForProject({
  data,
  parentsData,
}: {
  data: { project: ProjectProps; url: string };
  parentsData: [{ about: AboutInfo }];
}): WithContext<BlogPosting> {
  const { date, gallery, title, subtitle, description } = data.project;
  const url = data.url;
  const authorName = parentsData[0]?.about?.name || "";
  const baseUrl = new URL(url).origin;

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    url,
    description: subtitle || description,
    datePublished: date,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    image: gallery?.map((img) => baseUrl + img.url),
    author: {
      "@type": "Person",
      name: authorName,
    },
  };
}
