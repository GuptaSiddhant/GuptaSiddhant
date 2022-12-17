import clsx from "clsx";
import BlogIcon from "remixicon-react/QuillPenLineIcon";

import type { SummaryItem } from "@gs/summary";
import type { Gallery } from "@gs/types";

import { commonBlogProjectModel } from "../common-models";
import type { ModelObjectType, ModelStyling } from "../types";
import type { AboutInfo } from "../about/info";
import type { BlogPosting, WithContext } from "schema-dts";

const model: ModelObjectType = {
  type: "object",
  properties: {
    ...commonBlogProjectModel.properties,
    date: { type: "string", required: true },
  },
};

const styling: ModelStyling = {
  bg: clsx("bg-blue-500"),
  text: clsx("text-blue-500"),
  border: clsx("border-blue-500"),
  borderHocus: clsx("group-hocus:border-blue-500 selected:border-blue-500"),
  icon: <BlogIcon />,
};

export default { model, styling };

export interface BlogPostProps extends SummaryItem {
  content?: string;
  gallery?: Gallery;
}

export function generateStructuredDataForBlogPost({
  data,
  parentsData,
}: {
  data: { post: BlogPostProps; url: string };
  parentsData: [{ about: AboutInfo }];
}): WithContext<BlogPosting> {
  const { date, gallery, title, subtitle, description } = data.post;
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

export { BlogIcon };
