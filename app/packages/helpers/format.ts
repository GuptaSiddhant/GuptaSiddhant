import { ONE_DAY_IN_MS } from "../constants"

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export function toKebabCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(new RegExp(" ", "g"), "-")
    .replace(new RegExp("/", "g"), "--")
    .toLowerCase()
}

export function cleanupText(text?: string): string | undefined {
  if (!text) return undefined

  return text.replace(/â€”/g, ":")
}

export function formatDate(
  date: Date | string,
  options: Intl.DateTimeFormatOptions = {},
): string {
  return new Date(date).toLocaleDateString(undefined, {
    day: "numeric",
    month: "long",
    year: "numeric",
    ...options,
  })
}

export function formatList(list: string[], parts?: false): string
export function formatList(
  list: string[],
  parts: true,
): Array<{
  type: "literal" | "element"
  value: string
}>
export function formatList(list: string[], parts?: boolean) {
  const formatter = new Intl.ListFormat("en", {
    style: "long",
    type: "conjunction",
  })

  return parts ? formatter.formatToParts(list) : formatter.format(list)
}

export function transformMsToReadableString(ms: number): string {
  const dateStr: string[] = []
  const ONE_HOUR_IN_MS = 60 * 60 * 1000
  const ONE_MIN_IN_MS = 60 * 1000
  let remainingTimeInMs = ms

  const days = Math.floor(remainingTimeInMs / ONE_DAY_IN_MS)
  if (days === 1) dateStr.push("1 day")
  if (days > 1) dateStr.push(`${days} days`)
  remainingTimeInMs = remainingTimeInMs - days * ONE_DAY_IN_MS

  const hours = Math.floor(remainingTimeInMs / ONE_HOUR_IN_MS)
  if (hours === 1) dateStr.push("1 hour")
  if (hours > 1) dateStr.push(`${hours} hours`)
  remainingTimeInMs = remainingTimeInMs - hours * ONE_HOUR_IN_MS

  const minutes = Math.floor(remainingTimeInMs / ONE_MIN_IN_MS)
  if (minutes === 1) dateStr.push("1 minute")
  if (minutes > 1) dateStr.push(`${minutes} minutes`)
  remainingTimeInMs = remainingTimeInMs - minutes * ONE_MIN_IN_MS

  const seconds = remainingTimeInMs / 1000
  if (seconds === 1) dateStr.push("1 second")
  if (seconds > 1) dateStr.push(`${seconds.toFixed(2)} seconds`)

  return dateStr.join(", ")
}
