import clsx from "clsx"

export interface HeroImageProps {
  src?: string
  icon?: string
  alt?: string
  caption?: string
}

export default function HeroImage({
  alt,
  caption,
  icon,
  src,
}: HeroImageProps): JSX.Element | null {
  if (!src) return null

  return (
    <figure
      className={clsx(
        "relative",
        "-w-full-m4 mx-4 md:-w-full-m8 md:mx-8",
        "md:aspect-video",
      )}
    >
      <img
        src={src}
        alt={alt}
        className="object-cover h-full w-full min-h-[50vh] rounded-md"
        loading="eager"
      />
      {caption ? (
        <figcaption className="text-tertiary text-sm py-2">
          {caption}
        </figcaption>
      ) : null}
      {icon ? (
        <img
          src={icon}
          alt={alt ? `${alt} icon` : undefined}
          className="mb-2 h-12 rounded-sm object-contain absolute top-4 left-4"
          loading="eager"
        />
      ) : null}
    </figure>
  )
}
