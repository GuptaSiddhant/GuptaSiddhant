import {
  type ComponentPropsWithoutRef,
  type ForwardedRef,
  forwardRef,
} from "react"

export type ImgProps = ComponentPropsWithoutRef<"img"> & {
  imgRef?: ForwardedRef<HTMLImageElement> | null
}

export default function Img(props: ImgProps): JSX.Element | null {
  return <img alt={props.alt} loading="lazy" {...props} />
}

export const ImgWithRef = forwardRef<
  HTMLImageElement,
  ComponentPropsWithoutRef<"img">
>(function ImgWithRef(props, ref) {
  return <Img {...props} imgRef={ref} />
})
