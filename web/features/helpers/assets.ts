const cloudinaryBaseUrl =
  "https://guptasiddhant.mo.cloudinary.net/firebase-storage/"
const defaultCloudinaryTransformations = ["f_auto", "fl_progressive"]

export function generateTransformedAssetUrl(
  path: string,
  transformations?: Record<string, string>,
) {
  const transformationsList = defaultCloudinaryTransformations
  Object.entries(transformations || {}).forEach(([key, value]) => {
    transformationsList.push(`${key}_${value}`)
  })

  return `${cloudinaryBaseUrl}${path}?tx=${transformationsList.join(",")}`
}

export interface AssetTransformationOptions {
  /** Integer (>0) for px. Decimal (0-1) for percent. */
  width?: number
  /** Integer (>0) for px. Decimal (0-1) for percent. */
  height?: number
  /** [w/h] @example 16/9 or 1 */
  aspectRatio?: number
  /** Resize asset in a specific manner. @default "fill" */
  resize?: "fill" | "crop" | "scale" | "thumb" | "pad" | "fit"
  /** Resize asset from a specific origin point of a compass. */
  resizeOrigin?:
    | "auto"
    | "center"
    | "north"
    | "south"
    | "east"
    | "west"
    | `${"north" | "south"}_${"east" | "west"}`
  /** DPR multiplier. @default "auto" */
  dpr?: number

  /** Quality (integer 0-100). @default "auto" */
  quality?: number | "good" | "best" | "auto" | "eco" | "low"
}

export function generateAssetTransformations(
  options: AssetTransformationOptions,
  returnAsObject: false | undefined,
): string
export function generateAssetTransformations(
  options: AssetTransformationOptions,
  returnAsObject: true,
): Record<string, string>
export function generateAssetTransformations(
  options: AssetTransformationOptions,
  returnAsObject?: boolean,
): any {
  // https://cloudinary.com/documentation/media_optimizer_transformations#supported_transformations
  const transformations = new URLSearchParams()

  // https://cloudinary.com/documentation/resizing_and_cropping
  transformations.append("c", options.resize || "fill") // crop/resize
  transformations.append("dpr", options.dpr?.toFixed(2) || "auto")
  if (options.resizeOrigin) transformations.append("g", options.resizeOrigin)
  if (options.width) transformations.append("w", options.width.toFixed(2))
  if (options.height) transformations.append("h", options.height.toFixed(2))
  if (options.aspectRatio)
    transformations.append("ar", options.aspectRatio.toFixed(2))

  // https://cloudinary.com/documentation/image_optimization#how_to_optimize_image_quality
  transformations.append(
    "q",
    typeof options.quality === "number"
      ? options.quality.toFixed(2)
      : options.quality || "auto",
  )

  if (returnAsObject) return Object.fromEntries(transformations)
  return transformations.toString()
}
