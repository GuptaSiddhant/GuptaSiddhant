import type { Preview } from "./schema-type";

export function createDocumentPreview(
  title: string,
  subtitle: string,
  media: string = ""
): Preview {
  return { select: { title, subtitle, media } };
}
