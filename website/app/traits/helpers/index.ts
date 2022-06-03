export {}

export function isExternalLink(url: string): boolean {
  return url.includes("://")
}
