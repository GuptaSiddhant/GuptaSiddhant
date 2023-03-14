export const CLOUDINARY_BASE_URL =
  "https://guptasiddhant.mo.cloudinary.net/firebase-storage/";

export function generateCloudinaryUrl(
  path: string,
  transformations?: Record<string, string>,
) {
  const transformationsList: string[] = [];
  Object.entries(transformations || {}).forEach(([key, value]) => {
    transformationsList.push(`${key}_${value}`);
  });

  return `${CLOUDINARY_BASE_URL}${path}?tx=${transformationsList.join(",")}`;
}
