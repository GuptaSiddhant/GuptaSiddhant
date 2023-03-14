import { StyleSheet } from "@react-pdf/renderer";
import type { Style } from "@react-pdf/types";

import { type AboutInfo } from "@gs/models/about/info";
import { parseGetAllSearchParams } from "@gs/utils/navigation";

import useResumeContext from "./ResumeContext";
import { ResumeSections } from "./constants";
import { type ResumeColors, type ResumeTexts } from "./theme";
import type { ContactLinkProps } from "./types";

export function useStyleSheet(
  styles: (theme: {
    texts: ResumeTexts;
    colors: ResumeColors;
  }) => Record<string, Style>,
) {
  const { colors, texts } = useResumeContext();

  return StyleSheet.create(styles({ colors, texts }));
}

export function transformAboutLinkToContactLinks(
  link: AboutInfo["link"],
): ContactLinkProps[] {
  if (!link) {
    return [];
  }

  return Object.entries(link)
    .sort()
    .map(([key, linkUrl]) => {
      const value =
        key.toLowerCase() === "email"
          ? linkUrl.split(":")[1]
          : key.toLowerCase() === "website"
          ? linkUrl.split("//")[1]
          : key.toLowerCase() === "linkedin"
          ? linkUrl.split("in/")[1]
          : key.toLowerCase() === "github"
          ? linkUrl.split("com/")[1]
          : linkUrl;

      return {
        key,
        value,
        linkUrl,
      };
    });
}

export function createAboutLink(domain: string, id: string) {
  return `${domain}/about/${id}`;
}

export function getFiltersFromSearchParams(searchParams: URLSearchParams): {
  from?: Date;
  till?: Date;
  disabledSections?: Record<ResumeSections, boolean>;
  tags: string[];
} {
  const fromParam = searchParams.get("from");
  const toParam = searchParams.get("to");
  const tags = parseGetAllSearchParams(searchParams, "tag").map((t) =>
    t.toLowerCase(),
  );
  const enabledSections = parseGetAllSearchParams(searchParams, "section").map(
    (s) => s.toLowerCase(),
  );

  const disabledSections = {} as Record<ResumeSections, boolean>;
  if (enabledSections.length > 0) {
    Object.keys(ResumeSections).forEach((key) => {
      disabledSections[key as ResumeSections] = enabledSections.includes(key)
        ? false
        : true;
    });
  }

  return {
    disabledSections,
    from: fromParam ? new Date(fromParam) : undefined,
    till: toParam ? new Date(toParam) : undefined,
    tags,
  };
}
