import { Text } from "ink";
import type { DateTime } from "../types";

export default function DateLine({
  startDate,
  endDate,
  additionalText,
}: DateTime & {
  additionalText?: string;
}) {
  const start = startDate.slice(0, 7);
  const end = endDate?.slice(0, 7) || "current";
  return (
    <Text dimColor>
      {start} - {end}
      {additionalText ? ` | ${additionalText}` : ""}
    </Text>
  );
}
