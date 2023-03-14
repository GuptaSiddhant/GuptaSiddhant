export function isExternalLink(url: string): boolean {
  return ["://", "mailto:"].some((indicator) => url.includes(indicator));
}

export function parseGetAllSearchParams(
  searchParams: URLSearchParams,
  param: string,
): string[] {
  if (!(searchParams && param)) return [];

  return searchParams
    .getAll(param)
    .join(",")
    .split(",")
    .filter(Boolean)
    .map((s) => s.trim());
}
