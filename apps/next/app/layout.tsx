import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://next.guptasiddhant.com"),
  title: {
    default: "GS Playground",
    template: "%s | GS Playground",
  },
  description:
    "Siddhant Gupta's playground for tech experiments built with Next.js.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
