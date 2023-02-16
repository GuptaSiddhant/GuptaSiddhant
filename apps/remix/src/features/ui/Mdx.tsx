import MdxToJsx from "markdown-to-jsx";
import React, { type ElementType, Fragment, memo } from "react";

import { generateHeadingId } from "@gs/utils/mdx";

import { Pre } from "./CodeBlock";
import Img from "./Img";
import { AnchorLink } from "./Link";
import { H1, H2, H3, H4, H5, H6, type HeadingProps, Paragraph } from "./Text";

export interface MdxProps {
  mdx?: string;
  wrapper?: ElementType | null;
  lazyLoadImages?: boolean;
}

const Mdx = memo(function MarkdownComponent({
  mdx,
  wrapper = Fragment,
  lazyLoadImages = true,
}: MdxProps): JSX.Element | null {
  if (!mdx) {
    return null;
  }

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
          img: (props) => (
            <Img
              {...props}
              link
              loading={lazyLoadImages ? "lazy" : undefined}
            />
          ),
          pre: Pre,
          p: Paragraph,
          a: AnchorLink,
        },
      }}
    />
  );
});

export default Mdx;

// Helpers

function headingGenerator(Component: (props: HeadingProps) => JSX.Element) {
  return function Heading(props: { children: React.ReactNode }) {
    return <Component {...props} link id={generateHeadingId(props.children)} />;
  };
}
