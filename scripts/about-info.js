// @ts-check

const { setFirestoreDocument } = require("./firebase")

/** @type {Record<string, any>} */
const about = {
  techStack: [
    "React",
    "React Native",
    "TypeScript",
    "Node.JS",
    "GraphQL",
    "Figma",
  ],
  link: {
    website: "https://guptasiddhant.com",
    email: "mailto:me@guptasiddhant.com",
    github: "https://github.com/guptasiddhant",
    linkedin: "https://linkedin.com/in/guptasiddhant9",
  },
  name: "Siddhant Gupta",
  currentCompany: {
    link: "https://www.accenture.com/fi-en",
    hiringLink:
      "https://www.accenture.com/fi-en/careers/jobdetails?id=R00008034_en&title=Senior+React+Developer",
    name: "Accenture Song - Finland",
  },
  heroAdjectives: ["Responsibly", "Beautifully", "Accessibly"],
  title: "Senior Full-stack Developer",
  shortName: "GS",
  terminalResume: {
    code: '"# An interactive resume in your terminal, made with React and ink. \\n$ npx guptasiddhant"',
    copyText: "npx guptasiddhant",
  },
}

setFirestoreDocument("about", "info", about)
