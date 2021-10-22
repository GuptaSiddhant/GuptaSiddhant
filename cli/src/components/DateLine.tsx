import React from "react";
import { Text } from "ink";

export default function DateLine({
  startDate,
  endDate,
  additionalText,
}: {
  startDate: string;
  endDate?: string;
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
