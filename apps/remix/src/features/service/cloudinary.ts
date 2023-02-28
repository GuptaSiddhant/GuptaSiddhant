export function generateCloudinaryUrl(
  path: string,
  transformations?: Record<string, string>,
) {
  const cloudinaryBaseUrl =
    "https://guptasiddhant.mo.cloudinary.net/firebase-storage/";
  const transformationsList: string[] = [];
  Object.entries(transformations || {}).forEach(([key, value]) => {
    transformationsList.push(`${key}_${value}`);
  });

  return `${cloudinaryBaseUrl}${path}?tx=${transformationsList.join(",")}`;
}

export interface AssetTransformationOptions {
  /** Integer (>0) for px. Decimal (0-1) for percent. */
  width?: number;
  /** Integer (>0) for px. Decimal (0-1) for percent. */
  height?: number;
  /** [w/h] @example 16/9 or 1 */
  aspectRatio?: number;
  /** Resize asset in a specific manner. @default "fill" */
  resize?: "fill" | "crop" | "scale" | "thumb" | "pad" | "fit";
  /** Resize asset from a specific origin point of a compass. */
  resizeOrigin?:
    | "auto"
    | "center"
    | "north"
    | "south"
    | "east"
    | "west"
    | `${"north" | "south"}_${"east" | "west"}`;
  /** DPR multiplier.  */
  dpr?: number;

  /** Quality (integer 0-100) */
  quality?: number;
}

export function generateAssetTransformedUrl(
  url: string,
  options?: AssetTransformationOptions,
): string;
export function generateAssetTransformedUrl(
  url: string | undefined,
  options?: AssetTransformationOptions,
): string | undefined;
export function generateAssetTransformedUrl(
  url: string | undefined,
  options?: AssetTransformationOptions,
) {
  if (!url) {
    return undefined;
  }

  return `${url}?${generateAssetTransformations(options || {})}`;
}

export const assetTransformationOptions = {
  ICON: { aspectRatio: 1, height: 50, dpr: 2, resize: "fit" },
} as const satisfies Record<string, AssetTransformationOptions>;

// Helper function to generate transformations

function generateAssetTransformations(
  options: AssetTransformationOptions,
  returnAsObject?: false | undefined,
): string;
function generateAssetTransformations(
  options: AssetTransformationOptions,
  returnAsObject: true,
): Record<string, string>;
function generateAssetTransformations(
  options: AssetTransformationOptions,
  returnAsObject?: boolean,
): unknown {
  // https://cloudinary.com/documentation/media_optimizer_transformations#supported_transformations
  const transformations = new URLSearchParams({ f: "auto", fl: "progressive" });

  // https://cloudinary.com/documentation/resizing_and_cropping
  if (Object.keys(options).length > 0) {
    transformations.append("c", options.resize || "fill"); // crop/resize
  }
  if (options.dpr) {
    transformations.append("dpr", options.dpr.toString());
  }
  if (options.resizeOrigin) {
    transformations.append("g", options.resizeOrigin);
  }
  if (options.width) {
    transformations.append("w", options.width.toString());
  }
  if (options.height) {
    transformations.append("h", options.height.toString());
  }
  if (options.aspectRatio) {
    transformations.append("ar", options.aspectRatio.toString());
  }

  // https://cloudinary.com/documentation/image_optimization#how_to_optimize_image_quality
  if (options.quality) {
    transformations.append("q", options.quality.toString());
  }

  transformations.sort();

  if (returnAsObject) {
    return Object.fromEntries(transformations);
  }

  return transformations.toString();
}
