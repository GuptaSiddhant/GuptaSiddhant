import { type LinkDescriptor } from "react-router";

import fontStyles from "@gs/styles/font.css?url";
import globalStyles from "@gs/styles/global.css?url";
import prismThemeStyles from "@gs/styles/prism-vscode-dark.css?url";
import reachMenuButtonStyles from "@gs/styles/reach-menu-button.css?url";
import tailwindStyles from "@gs/styles/tailwind.css?url";

const stylesheets = [
  fontStyles,
  "/theme.css",
  globalStyles,
  tailwindStyles,
  prismThemeStyles,
  reachMenuButtonStyles,
];

const FirebaseStoragePreconnectLink: LinkDescriptor = {
  rel: "preconnect",
  href: "https://firebasestorage.googleapis.com",
};

const bundledFontPreloadLink: LinkDescriptor = {
  rel: "preload",
  href: "/fonts/Nunito.woff2",
  type: "font/woff2",
  crossOrigin: "anonymous",
  as: "font",
};

export const faviconLinks: LinkDescriptor[] = [
  { rel: "favicon", href: "/favicon.ico" },
  { rel: "shortcut icon", href: "/favicon.ico" },
  {
    rel: "apple-touch-icon",
    sizes: "180x180",
    href: "/assets/apple-touch-icon.png",
  },
  {
    rel: "icon",
    type: "image/png",
    sizes: "32x32",
    href: "/assets/favicon-32x32.png",
  },
  {
    rel: "icon",
    type: "image/png",
    sizes: "16x16",
    href: "/assets/favicon-16x16.png",
  },
  {
    rel: "mask-icon",
    href: "/assets/safari-pinned-tab.svg",
    color: "#5bbad5",
  },
];

export default function links(): LinkDescriptor[] {
  return [
    FirebaseStoragePreconnectLink,
    bundledFontPreloadLink,
    { rel: "manifest", href: "/site.webmanifest" },
    ...faviconLinks,
    ...stylesheets.map((href) => ({ rel: "stylesheet", href })),
  ];
}
