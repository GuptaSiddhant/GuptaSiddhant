import clsx from "clsx";
import {
  type ComponentPropsWithoutRef,
  type ForwardedRef,
  type ReactNode,
  forwardRef,
} from "react";

export type ImgProps = ComponentPropsWithoutRef<"img"> & {
  imgRef?: ForwardedRef<HTMLImageElement> | null;
  link?: boolean;
  children?: ReactNode;
  figureClassName?: string;
};

export default function Img({
  link,
  children,
  src,
  imgRef,
  figureClassName,
  ...props
}: ImgProps): JSX.Element | null {
  if (!src) {
    return null;
  }

  const imageElement = (
    <img
      alt=""
      src={src}
      {...props}
      className={clsx(props.className, "!m-0 rounded", "min-h-[200px]")}
      ref={imgRef}
    />
  );

  return (
    <figure
      className={clsx("relative -mx-4 overflow-clip rounded", figureClassName)}
    >
      {link ? (
        <a href={src} target="_blank" rel="noreferrer">
          {imageElement}
        </a>
      ) : (
        imageElement
      )}
      {children}
      {props.title ? (
        <figcaption className="text-center">{props.title}</figcaption>
      ) : null}
    </figure>
  );
}

export const ImgWithRef = forwardRef<
  HTMLImageElement,
  ComponentPropsWithoutRef<"img">
>(function ImgWithRef(props, ref) {
  return <Img {...props} imgRef={ref} />;
});
