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
