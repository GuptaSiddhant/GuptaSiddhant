import GithubFillIcon from "remixicon-react/GithubFillIcon"
import LinkedinBoxFillIcon from "remixicon-react/LinkedinBoxFillIcon"

import type { LinkObject } from "~/features/types"
import { ExternalLink } from "~/features/ui/Link"

export default function Linker({ links = [] }: { links?: LinkObject[] }) {
  const linksWithoutHomepage = links.filter((l) => l.type !== "homepage")

  if (linksWithoutHomepage.length === 0) return null

  return (
    <>
      <span>|</span>
      {linksWithoutHomepage.map(({ type, url, title }) => {
        const content = (() => {
          switch (type) {
            case "linkedin":
              return <LinkedinBoxFillIcon />
            case "github":
              return <GithubFillIcon />
            default:
              return title || type
          }
        })()

        return (
          <ExternalLink key={type || url} href={url} disableUnderline>
            {content}
          </ExternalLink>
        )
      })}
    </>
  )
}
