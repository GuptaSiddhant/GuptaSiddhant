import { encode } from "blurhash";
import { type Image, type ImageData, createCanvas, loadImage } from "canvas";

export default async function encodeImageToBlurhash(
  imgUrl: string,
): Promise<{ hash: string; height: number; width: number }> {
  const image = await loadImage(imgUrl);
  const { data, width, height } = getImageData(image);
  const hash = encode(data, width, height, 4, 4);

  return { hash, width, height };
}

function getImageData(image: Image): ImageData {
  const canvas = createCanvas(image.width, image.height);
  const context = canvas.getContext("2d")!;
  context.drawImage(image, 0, 0);

  return context.getImageData(0, 0, image.width, image.height);
}
