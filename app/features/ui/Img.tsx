import clsx from "clsx"
import {
  type ComponentPropsWithoutRef,
  type ForwardedRef,
  type ReactNode,
  forwardRef,
} from "react"

export type ImgProps = ComponentPropsWithoutRef<"img"> & {
  imgRef?: ForwardedRef<HTMLImageElement> | null
  link?: boolean
  children?: ReactNode
}

export default function Img({
  link,
  children,
  ...props
}: ImgProps): JSX.Element | null {
  if (!props.src) return null

  const imageElement = (
    <img
      alt=""
      {...props}
      className={clsx(props.className, "!m-0 rounded", "min-h-[200px]")}
      loading="lazy"
    />
  )

  return (
    <figure className="-mx-4 overflow-clip rounded relative">
      {link ? (
        <a href={props.src} target="_blank" rel="noreferrer">
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
  )
}

export const ImgWithRef = forwardRef<
  HTMLImageElement,
  ComponentPropsWithoutRef<"img">
>(function ImgWithRef(props, ref) {
  return <Img {...props} imgRef={ref} />
})
