import { Links, Meta } from "@remix-run/react"
import clsx from "clsx"

export default function Document({
  children,
  error,
  isDarkTheme = true,
}: {
  children: React.ReactNode
  error?: boolean
  isDarkTheme?: boolean
}): JSX.Element | null {
  const intlListFormatPolyfillScript =
    "https://polyfill.io/v3/polyfill.min.js?features=Intl.ListFormat,Intl.ListFormat.~locale.en"

  return (
    <html
      lang="en"
      dir="ltr"
      className={clsx(
        "text-[16px] lg:text-[18px] m-0 p-0",
        isDarkTheme && "dark",
      )}
    >
      <head>
        {error ? null : <Meta />}
        <Links />
        {error ? null : <script src={intlListFormatPolyfillScript} defer />}
      </head>
      <body className={clsx("m-0 p-0", "bg-default text-default")}>
        {children}
      </body>
    </html>
  )
}
