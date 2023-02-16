import type { ReactNode } from "react";

import { toKebabCase } from "@gs/utils/format";

export function generateHeadingId(children: ReactNode): string {
  return toKebabCase(children?.toString() || "");
}
