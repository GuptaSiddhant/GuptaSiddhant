import clsx from "clsx";

import type { ModelStyling } from "@gs/models/helpers/types";

import type { SummaryItem } from "./types";

export default function SummarySticker({
  draft,
  featured,
  styling,
}: SummaryItem & { styling?: ModelStyling }): JSX.Element | null {
  const styleClassName = clsx(
    "absolute top-0 right-0 rounded-bl-md rounded-tr-md px-2",
  );

  if (draft) {
    return <div className={clsx(styleClassName, "bg-black")}>Draft</div>;
  }

  if (featured) {
    return (
      <div
        className={clsx(
          styleClassName,
          styling?.bg || "bg-black",
          "text-white",
        )}
      >
        Featured
      </div>
    );
  }

  return null;
}
