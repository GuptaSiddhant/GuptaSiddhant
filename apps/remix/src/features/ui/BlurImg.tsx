import { decode } from "blurhash";
import { useEffect, useRef } from "react";

export interface BlurImgProps {
  src: string;
  alt: string;
  hash?: string;
  parentRef?: React.RefObject<HTMLElement>;
}

export default function BlurImg({ src, alt, hash, parentRef }: BlurImgProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const { width = 1000, height = 600 } =
      parentRef?.current?.getBoundingClientRect() || {
        width: 0,
        height: 0,
      };
    const canvas = canvasRef.current;
    if (hash && width && height && canvas) {
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        const pixels = decode(hash, width, height);
        const imageData = ctx.createImageData(width, height);
        imageData.data.set(pixels);
        ctx.putImageData(imageData, 0, 0);
      }
    }
  }, [hash, parentRef]);

  return (
    <>
      {hash && (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 z-0 rounded-md"
          data-hash={hash}
        />
      )}
      <img
        key={src}
        src={src}
        alt={alt}
        className="h-full min-h-[50vh] w-full rounded-md object-cover relative z-[1]"
      />
    </>
  );
}
