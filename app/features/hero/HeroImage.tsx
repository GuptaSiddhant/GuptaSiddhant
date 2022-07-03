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
        "mx-4 -w-full-m4 md:mx-8 md:-w-full-m8",
        "md:aspect-video md:max-h-screen",
      )}
    >
      <img
        src={src}
        alt={alt}
        className="h-full min-h-[50vh] w-full rounded-md object-cover"
        loading="eager"
      />
      {caption ? (
        <figcaption className="py-2 text-sm text-tertiary">
          {caption}
        </figcaption>
      ) : null}
      {icon ? (
        <img
          src={icon}
          alt={alt ? `${alt} icon` : undefined}
          className="absolute top-4 left-4 mb-2 h-12 rounded-md object-contain"
          loading="eager"
        />
      ) : null}
    </figure>
  )
}
