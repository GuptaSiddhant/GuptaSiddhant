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
