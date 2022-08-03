import { type DateTimeOptions, formatDate } from "@gs/utils/format"

export function generateDurationString<
  T extends {
    startDate: string
    endDate?: string
  },
>({ startDate, endDate }: T, options: DateTimeOptions = {}): string {
  const start = formatDate(startDate, { day: undefined, ...options })
  const end = endDate
    ? formatDate(endDate, { day: undefined, ...options })
    : "Present"

  return [start, end].filter(Boolean).join(" - ")
}
