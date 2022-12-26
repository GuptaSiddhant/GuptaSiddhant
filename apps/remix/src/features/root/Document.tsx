import clsx from "clsx";

import { Links, Meta } from "@remix-run/react";
import { StructuredData } from "remix-utils";

import { type ThemeName, checkIfDarkTheme } from "@gs/theme";

const intlListFormatPolyfillScript =
  "https://polyfill.io/v3/polyfill.min.js?features=Intl.ListFormat,Intl.ListFormat.~locale.en";

export default function Document({
  children,
  error,
  themeName,
}: {
  children: React.ReactNode;
  error?: boolean;
  themeName?: ThemeName;
}): JSX.Element | null {
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
        {error ? null : <script src={intlListFormatPolyfillScript} defer />}
        <StructuredData />
      </head>
      <body className={clsx("m-0 p-0", "bg-default text-default")}>
        {children}
      </body>
    </html>
  );
}
