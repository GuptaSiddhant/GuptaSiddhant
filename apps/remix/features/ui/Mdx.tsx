import MdxToJsx from "markdown-to-jsx"
import { type ElementType, Fragment, memo } from "react"

import { generateHeadingId } from "@features/helpers"
import { type TocItem } from "@features/helpers/table-of-contents"

import { Pre } from "./CodeBlock"
import Img from "./Img"
import { AnchorLink } from "./Link"
import { type HeadingProps, H1, H2, H3, H4, H5, H6, Paragraph } from "./Text"

export interface MdxSectionProps {
  id?: string
  mdx?: string
  toc?: TocItem[]
}

const Mdx = memo(function MarkdownComponent({
  mdx,
  wrapper = Fragment,
}: {
  mdx?: string
  wrapper?: ElementType<any> | null
}): JSX.Element | null {
  if (!mdx) return null

  return (
    <MdxToJsx
      children={mdx}
      options={{
        wrapper,
        overrides: {
          h1: headingGenerator(H1),
          h2: headingGenerator(H2),
          h3: headingGenerator(H3),
          h4: headingGenerator(H4),
          h5: headingGenerator(H5),
          h6: headingGenerator(H6),
          img: (props) => <Img {...props} link loading="lazy" />,
          pre: Pre,
          p: Paragraph,
          a: AnchorLink,
        },
      }}
    />
  )
})

export default Mdx

// Helpers

function headingGenerator(Component: (props: HeadingProps) => JSX.Element) {
  return function Heading(props: any) {
    return <Component {...props} link id={generateHeadingId(props.children)} />
  }
}
