export function isExternalLink(url: string): boolean {
  return ["://", "mailto:"].some((indicator) => url.includes(indicator));
}
