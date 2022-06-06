export function isExternalLink(url: string): boolean {
  return url.includes("://")
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
