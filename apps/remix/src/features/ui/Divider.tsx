import clsx from "clsx";

import { proseWidth } from "./Section";

export default function Divider(): JSX.Element {
  return (
    <div
      className={clsx(proseWidth, "border-b border-solid border-gray-600")}
    />
  );
}
