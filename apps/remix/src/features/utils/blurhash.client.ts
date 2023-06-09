import { encode } from "blurhash";

export interface BlurhashData {
  hash: string;
  width: number;
  height: number;
  colorSpace: PredefinedColorSpace;
  url: string;
}

const defaultData: BlurhashData = {
  hash: "",
  width: 0,
  height: 0,
  colorSpace: "srgb",
  url: "",
};

const DEFAULT_COMPONENT_X = 5;
const DEFAULT_COMPONENT_Y = 5;

export async function encodeImageToBlurhash(
  imageOrUrl: string | HTMLImageElement | undefined,
  componentX = DEFAULT_COMPONENT_X,
  componentY = DEFAULT_COMPONENT_Y,
): Promise<BlurhashData> {
  if (!imageOrUrl) return defaultData;

  try {
    let image: HTMLImageElement | undefined = undefined;

    if (typeof imageOrUrl !== "string") {
      image = imageOrUrl.complete
        ? imageOrUrl
        : await loadImage(imageOrUrl.src);
    } else {
      image = await loadImage(imageOrUrl);
    }

    const { data: pixels, colorSpace, height, width } = getImageData(image);
    const hash = encode(pixels, width, height, componentX, componentY);

    return {
      hash,
      width,
      height,
      colorSpace,
      url: typeof imageOrUrl === "string" ? imageOrUrl : image.src,
    };
  } catch {
    return defaultData;
  }
}

function getImageData(image: HTMLImageElement): ImageData {
  const canvas = document.createElement("canvas").transferControlToOffscreen();
  canvas.width = image.width;
  canvas.height = image.height;
  const context = canvas.getContext("2d")!;
  context.drawImage(image, 0, 0);

  return context.getImageData(0, 0, image.width, image.height);
}

async function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = (...args) => reject(args);
    img.crossOrigin = "Anonymous";
    img.src = src;
  });
}
