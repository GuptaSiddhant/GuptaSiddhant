export const contacts: Array<{
  key: string;
  label: string;
  value?: string;
  url?: string;
}> = [
  { key: "w", label: "Website", url: "https://guptasiddhant.com" },
  { key: "g", label: "GitHub", url: "https://github.com/guptasiddhant" },
  {
    key: "l",
    label: "LinkedIn",
    url: "https://linkedin.com/in/guptasiddhant9",
  },
  {
    key: "m",
    label: "E-mail",
    value: "me@guptasiddhant.com",
    url: "mailto:me@guptasiddhant.com",
  },
];

export const about = `I'm a frontend developer with a background in UI design. 
Over the years, I have worked in multiple companies, startups and freelance projects.
If I had to describe myself in one word, that’d be STALWART.
`;

export const skills = [
  {
    type: "Frontend development",
    value: "TypeScript, JavaScript, ReactJS, NodeJS, CSS, HTML",
  },
  {
    type: "Other dev.",
    value:
      "Bash, NPM, Git, Jira, Docker, Firebase, Flutter, Dart, C++, Clojure, Python, Django",
  },
  {
    type: "Design",
    value:
      "Sketch, InVision, Figma, MarvelApp, Adobe XD, Adobe Photoshop, Adobe InDesign",
  },
];
