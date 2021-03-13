// const grey000 = "hsl(0,0,000)";
const grey010 = "hsl(0,0,010)";
const grey020 = "hsl(0,0,020)";
const grey030 = "hsl(0,0,030)";
// const grey040 = "hsl(0,0,040)";
// const grey050 = "hsl(0,0,050)";
// const grey060 = "hsl(0,0,060)";
const grey070 = "hsl(0,0,070)";
// const grey080 = "hsl(0,0,080)";
const grey090 = "hsl(0,0,090)";
const grey100 = "hsl(0,0,100)";

// interface ColorObject {
//   primary: string;
//   secondary: string;
//   disabled: string;
// }

const colorVariable = (name: string, color: string = "") =>
  `var(--color-${name}, ${color})`;

const color = {
  text: {
    primary: colorVariable("text-primary", grey010),
    secondary: colorVariable("text-secondary", grey020),
    disabled: colorVariable("text-disabled", grey030),
  },
  background: {
    primary: colorVariable("background-primary", grey100),
    secondary: colorVariable("background-secondary", grey090),
    disabled: colorVariable("background-disabled", grey070),
  },
} as const;

export type Color = typeof color;

// export const setTheme = (darkMode: boolean = false) => {
//   const theme: Color = {
//     text: {
//       primary: darkMode ? grey090 : grey010,
//       secondary: darkMode ? grey080 : grey020,
//       disabled: darkMode ? grey070 : grey030,
//     },
//     background: {
//       primary: darkMode ? grey010 : grey100,
//       secondary: darkMode ? grey000 : grey090,
//       disabled: darkMode ? grey030 : grey070,
//     },
//   };

//   let cssString = ":root {";
//   Object.entries(theme).forEach(([type, typeObj]) => {
//     Object.entries(typeObj).forEach(([variant, color]) => {
//       cssString += `--color-${type}-${variant}: ${color}; `;
//     });
//   });
//   cssString += `--darkmode: ${darkMode}; } `;

//   // Place it in DOM
//   const styleTagID = "style-theme";
//   const existingStyleTag = document.getElementById(
//     styleTagID
//   ) as HTMLStyleElement | null;

//   const newStyleTag = document.createElement("style");
//   newStyleTag.id = styleTagID;

//   const styleTag: HTMLStyleElement = existingStyleTag || newStyleTag;
//   styleTag.innerHTML = cssString;

//   if (!existingStyleTag)
//     document.head.insertAdjacentElement("beforeend", styleTag);
// };

export default color;
