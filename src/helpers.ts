import { dim } from "ansi-colors";

/** Log information in tabular columns */
export const logTable = (
  info: {
    key: string;
    value: string;
  }[]
) => {
  const maxKeyLength = info.reduce(
    (acc, cur) => Math.max(acc, cur.key.length),
    0
  );
  info.forEach(({ key, value }) => {
    const keySpace = new Array(maxKeyLength - key.length).fill(" ").join("");
    console.log(" ", dim(key + ":" + keySpace), value);
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
