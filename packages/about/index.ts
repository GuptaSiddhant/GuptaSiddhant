export const title = "Siddhant Gupta"
export const currentCompany = {
  name: "Accenture Song",
  link: undefined,
  hiringLink: undefined,
}

export const socialLinks = {
  linkedin: "https://linkedin.com/in/guptasiddhant9",
  github: "https://github.com/guptasiddhant",
  email: "me@guptasiddhant.com",
  homepage: "https://guptasiddhant.com",
}

export const gallery = [
  {
    url: "/favicon/android-chrome-384x384.png",
    alt: "Siddhant Gupta's profile",
  },
]

export const heroAdjectives = [
  "Responsibly",
  "Beautifully",
  "Accessibly",
].sort()

export const techStackList = [
  "React",
  "React Native",
  "TypeScript",
  "Node.js",
  "GraphQL",
  "Figma",
]

export const skills: Skills = {
  languages: [
    { name: "English", level: "Native (C2)" },
    { name: "Hindi", level: "Native (C1)" },
    { name: "Finnish", level: "Basic (A1)" },
    { name: "French", level: "Basic (A1)" },
  ],
  soft: [
    "Public speaking",
    "demonstrations",
    "problem solving",
    "teamwork",
    "entrepreneurship",
    "leadership",
  ],
  frontend: [
    "TypeScript",
    "JavaScript",
    "React",
    "Redux",
    "Next.js",
    "Remix-run",
    "HTML",
    "CSS",
    "SASS",
    "Styled-components",
    "Storybook",
  ],
  backend: ["NodeJS", "GraphQL", "Firebase", "Wordpress"],
  core: ["Git", "Bash", "Markdown", "Jest", "esbuild", "Webpack", "NPM"],
  tools: [
    "VSCode",
    "Jetbrains Webstorm",
    "GitHub",
    "Gitlab",
    "Bitbucket",
    "Jira",
    "Azure Devops",
    "Docker",
  ],
  design: ["Figma", "Sketch", "InVision", "XD", "Photoshop", "InDesign"],
  other: [
    "Python",
    "Dart",
    "GoLang",
    "MySQL",
    "C++",
    "ClojureScript",
    "Deno",
    "Gatsby",
    "Django",
    "Flutter ",
  ],
}

export interface Skills extends Record<SkillCategory, string[]> {
  languages: { name: string; level: string }[]
}

export type SkillCategory =
  | "soft"
  | "frontend"
  | "backend"
  | "core"
  | "tools"
  | "design"
  | "other"
