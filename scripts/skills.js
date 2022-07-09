// @ts-check

const { setFirestoreDocument } = require("./firebase")

/** @typedef {{title: string, linkUrl?: string, iconUrl?: string, level?: 'advanced' | 'intermediate' | 'basic'}} Skill */

/** @type {Skill[]} */
const language = [
  { title: "English", level: "advanced" },
  { title: "Hindi", level: "advanced" },
  { title: "Finnish", level: "basic" },
  { title: "French", level: "basic" },
]

/** @type {Skill[]} */
const soft = [
  { title: "Public speaking" },
  { title: "demonstrations" },
  { title: "problem solving" },
  { title: "teamwork" },
  { title: "entrepreneurship" },
  { title: "leadership" },
]

/** @type {Skill[]} */
const frontend = [
  {
    title: "TypeScript",
    linkUrl: "https://www.typescriptlang.org/",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
    level: "advanced",
  },
  {
    title: "JavaScript",
    linkUrl: "https://developer.mozilla.org/en/JavaScript",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
    level: "advanced",
  },
  {
    title: "ReactJS",
    linkUrl: "https://reactjs.org",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
    level: "advanced",
  },
  {
    title: "Remix-run",
    linkUrl: "https://remix.run",
    iconUrl:
      "https://pbs.twimg.com/profile_images/1425897037602586625/ID6pueIo_400x400.png",
    level: "advanced",
  },
  {
    title: "Redux",
    linkUrl: "https://redux.js.org",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redux/redux-original.svg",
    level: "advanced",
  },
  {
    title: "NextJS",
    linkUrl: "https://nextjs.org",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg",
    level: "advanced",
  },
  {
    title: "StorybookJS",
    linkUrl: "https://storybook.js.org",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/storybook/storybook-original.svg",
    level: "advanced",
  },
  {
    title: "HTML",
    linkUrl: "https://html.spec.whatwg.org",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg",
    level: "advanced",
  },
  {
    title: "CSS",
    linkUrl: "https://www.w3.org/Style/CSS/Overview.en.html",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg",
    level: "advanced",
  },
  {
    title: "SASS",
    linkUrl: "https://sass-lang.com",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sass/sass-original.svg",
    level: "advanced",
  },
]

/** @type {Skill[]} */
const backend = [
  {
    title: "NodeJS",
    linkUrl: "https://nodejs.org/",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
    level: "advanced",
  },
  {
    title: "Deno",
    linkUrl: "https://deno.land/",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/denojs/denojs-original.svg",
    level: "basic",
  },
  {
    title: "GraphQL",
    linkUrl: "https://graphql.org",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/graphql/graphql-plain.svg",
    level: "advanced",
  },
  {
    title: "Firebase",
    linkUrl: "https://firebase.google.com",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg",
    level: "advanced",
  },
  {
    title: "Wordpress",
    linkUrl: "https://wordpress.org",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/wordpress/wordpress-original.svg",
    level: "intermediate",
  },
]

/** @type {Skill[]} */
const design = [
  {
    title: "Figma",
    linkUrl: "https://figma.com",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg",
    level: "advanced",
  },
  {
    title: "Sketch",
    linkUrl: "https://sketch.com",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sketch/sketch-original.svg",
    level: "advanced",
  },
  {
    title: "Photoshob",
    linkUrl: "https://www.adobe.com/products/photoshop.html",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/photoshop/photoshop-plain.svg",
    level: "advanced",
  },
]

/** @type {Record<string, Skill[]>} */
const skills = {
  soft,
  frontend,
  backend,
  design,
  language,
}

setFirestoreDocument("info", "skills", skills)
