import { PageContent } from "../helpers";
import { defaultSlides } from "../helpers/slidesTrigger";
import { Paragraph } from "../components/Text";

export default {
  id: "contact",
  title: "Contact",
  description: (
    <>
      <Paragraph>
        Hi, I am Siddhant Gupta, a designer and developer. I excel in developing
        web-applications that are modern, professional, accessible and stalwart.
      </Paragraph>
      <Paragraph>
        I am always looking to learn something new to challenge me and my
        methods. And let’s face it, in the world of web, there is something
        always new.
      </Paragraph>
      <Paragraph>
        My stack: <br /> React, TypeScript, Node.JS, Bash, Sketch
      </Paragraph>
    </>
  ),
  slides: defaultSlides,
  items: [],
} as PageContent;
