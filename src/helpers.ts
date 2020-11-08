import colors, { StylesType } from "ansi-colors";

interface LogTableItem {
  key: string;
  value?: string;
  color?: keyof StylesType<any>;
}

/** Log information in tabular columns */
export const logTable = (info: LogTableItem[]) => {
  const maxKeyLength = info.reduce(
    (acc, cur) => Math.max(acc, cur.key.length),
    0
  );
  console.log(""); // Line break
  info.forEach(({ key, value = "", color }) => {
    const keySpace = new Array(maxKeyLength - key.length).fill(" ").join("");
    console.log(
      " ",
      colors["dim"](key + keySpace + " :"),
      colors[color || "reset"](value.replace("\n", " "))
    );
  });
};

/** Wrap text with charLimit per sentence */
export const wrapText = (text: string, charLimit: number = 40) => {
  const newStr: string[] = [];
  let sentence: string = "";
  text.split(" ").forEach((word) => {
    if (sentence.length > charLimit) {
      newStr.push(sentence);
      sentence = "";
    }
    sentence += word + " ";
  });
  newStr.push(sentence);
  return "  " + newStr.join("\n  ");
};
