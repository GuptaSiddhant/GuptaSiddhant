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
    key: "e",
    label: "E-mail",
    value: "me@guptasiddhant.com",
    url: "mailto:me@guptasiddhant.com",
  },
];

const maxLabelSpace = contacts.reduce(
  (space, { label }) => Math.max(space, label.length),
  0
);

export const contactList = contacts
  .map(
    ({ label, value, url }) => `${label.padEnd(maxLabelSpace)}: ${value || url}`
  )
  .join("\n");
