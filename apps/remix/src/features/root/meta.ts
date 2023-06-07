import type { WebSite, WithContext } from "schema-dts";

import { getThemeFromThemeName } from "@gs/theme";
import type { MetaArgs, MetaDescriptors } from "@gs/types";

import type { RootLoaderData } from ".";

type RootMetaArgs = MetaArgs<() => RootLoaderData>;

const domainUrl = "https://GuptaSiddhant.com";
const thumbnailUrl =
  "https://GuptaSiddhant.com/assets/android-chrome-512x512.png";

export default function meta({ data }: RootMetaArgs): MetaDescriptors {
  const themeName = data?.themeName;
  const isPwa = data?.isPwa ?? false;
  const name = data?.about?.name ?? "Siddhant Gupta";
  const shortName = data?.about?.shortName ?? "GS";
  const jobTitle = data?.about?.title;
  const description = "Webfolio of a creator.";

  const theme = getThemeFromThemeName(themeName);
  const themeColor = theme.bg.default;
  const viewport = [
    "width=device-width",
    "initial-scale=1.0",
    "viewport-fit=cover",
    isPwa ? "maximum-scale=1.0" : "",
  ]
    .filter(Boolean)
    .join(",");

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    url: domainUrl,
    name,
    description,
    thumbnailUrl,
    creator: {
      "@type": "Person",
      name,
      gender: "male",
      jobTitle,
    },
  } satisfies WithContext<WebSite>;

  return [
    { title: name },
    { charset: "utf-8" },

    { name: "description", content: description },
    { name: "viewport", content: viewport },
    { name: "application-name", content: shortName },
    { name: "apple-mobile-web-app-title", content: shortName },
    { name: "theme-color", content: themeColor },
    { name: "msapplication-TileColor", content: themeColor },
    { name: "msapplication-config", content: "/assets/browserconfig.xml" },

    // Open graph
    { property: "og:title", content: name },
    { property: "og:description", content: description },
    { property: "og:url", content: domainUrl },
    { property: "og:locale", content: "en_GB" },
    { property: "og:type", content: "website" },
    { property: "og:site_name", content: shortName },
    { property: "og:image", content: thumbnailUrl },

    // Twitter
    { name: "twitter:creator", content: "@guptasiddhant9" },
    { name: "twitter:card", content: "summary" },
    { name: "twitter:title", content: name },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: thumbnailUrl },

    { "script:ld+json": structuredData },
  ];
}
