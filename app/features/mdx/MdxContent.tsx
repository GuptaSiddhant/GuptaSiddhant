import MDX from "markdown-to-jsx"
import { type ElementType, Fragment, memo } from "react"

import { Pre } from "../ui/CodeBlock"
import Img from "../ui/Img"
import { AnchorLink } from "../ui/Link"
import {
  type HeadingProps,
  H1,
  H2,
  H3,
  H4,
  H5,
  H6,
  Paragraph,
} from "../ui/Text"
import { generateHeadingId } from "./helpers"

const MdxContent = memo(function MarkdownComponent({
  mdx,
  wrapper = Fragment,
}: {
  mdx: string
  wrapper?: ElementType<any> | null
}): JSX.Element {
  return (
    <MDX
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

export default MdxContent

function headingGenerator(Component: (props: HeadingProps) => JSX.Element) {
  return function Heading(props: any) {
    return <Component {...props} link id={generateHeadingId(props.children)} />
  }
}
