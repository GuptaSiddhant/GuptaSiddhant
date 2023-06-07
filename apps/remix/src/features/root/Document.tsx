import { Links, Meta } from "@remix-run/react";
import clsx from "clsx";

import { type ThemeName, checkIfDarkTheme } from "@gs/theme";

export interface DocumentProps {
  children: React.ReactNode;
  error?: boolean;
  themeName?: ThemeName;
}

export default function Document({
  children,
  error,
  themeName,
}: DocumentProps): JSX.Element | null {
  const isDarkTheme = checkIfDarkTheme(themeName);

  return (
    <html
      lang="en"
      dir="ltr"
      className={clsx(
        "m-0 p-0 text-[16px] lg:text-[18px]",
        isDarkTheme ? "dark" : "light",
      )}
    >
      <head>
        {error ? null : <Meta />}
        <Links />
        {error ? null : <script src={generatePolyfillUrl()} defer />}
      </head>
      <body className={clsx("m-0 p-0", "bg-default text-default")}>
        {children}
      </body>
    </html>
  );
}

function generatePolyfillUrl() {
  const baseUrl = "https://polyfill.io/v3/polyfill.min.js?features=";
  const features = ["Intl.ListFormat", "Intl.ListFormat.~locale.en"];

  return `${baseUrl}${features.join(",")}`;
}
