import {
  DEFAULT_LOCALE,
  ONE_DAY_IN_MS,
  ONE_HOUR_IN_MS,
  ONE_MIN_IN_MS,
} from "@gs/constants"

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

// DateTime

export interface DateTimeOptions extends Intl.DateTimeFormatOptions {
  locale?: string
}

export function formatYYYYMMDD(date?: Date) {
  if (!date) return undefined

  const YYYY = date.getFullYear().toString().padStart(4, "0")
  const MM = (date.getMonth() + 1).toString().padStart(2, "0")
  const DD = date.getDate().toString().padStart(2, "0")

  return `${YYYY}-${MM}-${DD}`
}

export function formatDate(
  date: Date | string,
  { locale = DEFAULT_LOCALE, ...options }: DateTimeOptions = {},
): string {
  return new Date(date).toLocaleDateString(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
    ...options,
  })
}

export function formatTime(
  date: Date | string,
  locale: string = DEFAULT_LOCALE,
): string {
  return new Date(date).toLocaleTimeString(locale)
}

export function formatDateTime(
  date: Date | string,
  { locale = DEFAULT_LOCALE, ...options }: DateTimeOptions = {},
): string {
  return new Date(date).toLocaleDateString(locale, {
    day: "numeric",
    month: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    ...options,
  })
}

export function formatUnit(
  value: number,
  unit: string = "byte",
  locale: string = DEFAULT_LOCALE,
): string {
  return new Intl.NumberFormat(locale, {
    style: "unit",
    unit,
    unitDisplay: "long",
    maximumFractionDigits: 2,
    // minimumFractionDigits: 2,
  }).format(value)
}

export function formatList(
  list: string[],
  parts?: false,
  locale?: string,
): string
export function formatList(
  list: string[],
  parts: true,
  locale?: string,
): Array<{
  type: "literal" | "element"
  value: string
}>
export function formatList(
  list: string[],
  parts?: boolean,
  locale: string = DEFAULT_LOCALE,
) {
  const formatter = new Intl.ListFormat(locale, {
    style: "long",
    type: "conjunction",
  })

  return parts ? formatter.formatToParts(list) : formatter.format(list)
}

export function transformMsToReadableString(ms: number): string {
  const dateStr: string[] = []
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

  return formatList(dateStr)
}
