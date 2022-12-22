import { type MetaDescriptor } from "@remix-run/server-runtime";

import { getThemeFromThemeName } from "@gs/theme";

import type { RootLoaderData } from ".";

export default function meta({
	data,
	location,
}: {
	data: RootLoaderData;
	location: Location;
}): MetaDescriptor {
	const { themeName, about } = data;
	const { name = "Siddhant Gupta", shortName = "GS" } = about;
	const description = "Webfolio of a creator.";

	const isPwa = new URLSearchParams(location.search).has("pwa");
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

	return {
		title: name,
		description,
		charset: "utf-8",
		viewport,

		"application-name": shortName,
		"apple-mobile-web-app-title": shortName,
		"theme-color": themeColor,
		"msapplication-TileColor": themeColor,
		"msapplication-config": "/assets/browserconfig.xml",

		// Open graph
		"og:title": name,
		"og:description": description,
		"og:locale": "en_GB",
		"og:type": "website",
		"og:site_name": shortName,

		// Twitter
		"twitter:creator": "@guptasiddhant9",
		"twitter:card": "summary",
	};
}
