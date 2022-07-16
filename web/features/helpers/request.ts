export function parseGetAllSearchParams(
  searchParams: URLSearchParams,
  param: string,
): string[] {
  return (
    searchParams
      .getAll(param)
      .join(",")
      .split(",")
      .filter(Boolean)
      .map((s) => s.trim()) || []
  )
}
