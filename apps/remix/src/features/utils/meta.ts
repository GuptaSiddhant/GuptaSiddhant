import type { V2_ServerRuntimeMetaArgs } from "@remix-run/server-runtime";

import { AUTHOR_NAME, AUTHOR_SHORT_NAME } from "@gs/constants";
import { type SummaryItem } from "@gs/summary";
import type { MetaDescriptors } from "@gs/types";

export function createMetaTitle(title?: string) {
  if (!title) return AUTHOR_NAME;

  return `${title} | ${AUTHOR_SHORT_NAME}`;
}

export function generateArticleMeta(
  article?: SummaryItem,
  options?: {
    id?: string;
    section?: string;
    url?: string;
    matches: V2_ServerRuntimeMetaArgs["matches"];
  },
): MetaDescriptors {
  if (!article) {
    const section = options?.section || "Article";

    return [
      { title: `${section} 404` },
      {
        name: "description",
        content: `${section} '${options?.id}' not found`,
      },
    ];
  }

  const url = options?.url ? new URL(options?.url) : undefined;

  const {
    title,
    description,
    cover,
    tags = [],
    linkUrl,
    subtitle = "",
    date,
  } = article;

  const searchParams = new URLSearchParams({
    title,
    subtitle,
    imageUrl: cover || "",
    url: options?.url || linkUrl || "",
    caption: options?.section || "",
    authorName: AUTHOR_NAME,
    authorImageUrl: "https://people.aalto.fi/files/1201903_x_512_3to4.jpg",
  });

  const socialImageUrl = `${
    url?.origin || ""
  }/social-image.png?${searchParams.toString()}`;

  const publishedTime = date ? new Date(date).toISOString() : undefined;

  const essentialMeta = extractEssentialMetaFromMetaMatches(
    options?.matches || [],
  );

  return [
    ...essentialMeta,

    { title: createMetaTitle(title) },
    { name: "description", content: description || subtitle },
    { name: "twitter:card", content: "summary_large_image" },

    { property: "og:title", content: title },
    { property: "og:description", content: description || subtitle },
    { property: "og:author", content: AUTHOR_NAME },
    { property: "og:image", content: socialImageUrl },
    { property: "og:url", content: options?.url },
    { property: "og:type", content: "article" },
    { property: "og:section", content: options?.section },
    { property: "og:tag", content: tags.join(",") },
    { property: "og:published_time", content: publishedTime },
    { property: "og:article:published_time", content: publishedTime },
    { property: "og:article:section", content: options?.section },
    { property: "og:article:tag", content: tags.join(",") },
    { property: "og:article:author", content: AUTHOR_NAME },
  ];
}

export function extractMetaFromMetaMatches(
  matches: V2_ServerRuntimeMetaArgs["matches"],
  options: { exclude?: string[]; routeId?: string } = {},
) {
  const { exclude = [], routeId } = options;

  const rootMeta = routeId
    ? matches.find((m) => m.id === routeId)?.meta
    : matches[0]?.meta;

  if (!rootMeta) return [];
  if (!exclude || exclude.length === 0) return rootMeta;

  return rootMeta.filter((m) => {
    if ("title" in m && exclude.includes("title")) {
      return false;
    }

    if ("name" in m && typeof m.name === "string" && exclude.includes(m.name)) {
      return false;
    }

    if (
      "property" in m &&
      typeof m.property === "string" &&
      exclude.includes(m.property)
    ) {
      return false;
    }

    return true;
  });
}

export function extractEssentialMetaFromMetaMatches(
  matches: V2_ServerRuntimeMetaArgs["matches"],
): MetaDescriptors {
  const rootMeta = matches[0]?.meta;
  const essentialMeta = [
    "viewport",
    "theme-color",
    "application-name",
    "apple-mobile-web-app-title",
    "twitter:creator",
    "msapplication-TileColor",
    "msapplication-config",
  ];

  return rootMeta.filter(
    (m) =>
      "name" in m &&
      typeof m.name === "string" &&
      essentialMeta.includes(m.name),
  );
}

export type { MetaArgs, MetaDescriptors } from "@gs/types";
