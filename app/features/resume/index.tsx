import { renderToString } from "@react-pdf/renderer"

import Resume, { type ResumeProps } from "./Resume"

export default async function handler(request: Request): Promise<string> {
  const resumeProps: ResumeProps = {
    name: "Siddhant Gupta",
    position: "Full-stack & UI developer",
    contactLinks: [
      {
        key: "Website",
        value: "guptasiddhant.com",
        linkUrl: "https://guptasiddhant.com",
      },
      {
        key: "Email",
        value: "me@guptasiddhant.com",
        linkUrl: "mailto:me@guptasiddhant.com",
      },
      {
        key: "GitHub",
        value: "guptasiddhant",
        linkUrl: "https://github.com/guptasiddhant",
      },
      {
        key: "LinkedIn",
        value: "guptasiddhant9",
        linkUrl: "https://linkedin.com/in/guptasiddhant9",
      },
    ],
  }

  return renderToString(<Resume {...resumeProps} />)
}
