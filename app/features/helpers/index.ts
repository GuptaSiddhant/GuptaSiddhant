export function isExternalLink(url: string): boolean {
  return ["://", "mailto:"].some((indicator) => url.includes(indicator))
}

export async function downloadFileWithUrl(
  name: string,
  url: string,
): Promise<void> {
  const link = document.createElement("a")
  link.href = url
  link.download = name
  link.click()
}

export function generateUniqueId(prefix?: string): string {
  return `${prefix || ""}${Math.random().toString(36).substr(2, 9)}`
}

export function sortByDate(
  a?: Date | string | number,
  b?: Date | string | number,
  invert: boolean = false,
) {
  const order =
    (b?.toString() || new Date().toISOString()) >
    (a?.toString() || new Date().toISOString())

  if (invert) return order ? -1 : 1
  return order ? 1 : -1
}
