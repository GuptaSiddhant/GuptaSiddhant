import { Link } from "@remix-run/react"
import clsx from "clsx"

import type { TeaserProps } from "~/packages/types"

export default function ProjectCard({
  project,
  className,
}: {
  project: TeaserProps
  className?: string
}): JSX.Element {
  const { id, title, icon, cover, subtitle, description, featured } = project
  const showDescription = Boolean(featured && description)

  return (
    <Link to={id} prefetch="intent" className={clsx("group", className)}>
      <article
        className={clsx(
          "relative",
          "h-full overflow-hidden rounded-lg",
          "bg-secondary bg-cover bg-center bg-no-repeat",
        )}
        style={{ backgroundImage: `url(${cover})` }}
      >
        {icon ? (
          <div className="absolute bottom-4 left-4">
            <img
              src={icon}
              alt={title}
              className="h-12 rounded object-contain"
            />
          </div>
        ) : null}
        <div
          className={clsx(
            "rounded-lg",
            "h-0 w-full p-4 pl-8 group-hover:h-full group-focus:h-full",
            "group-hover:bg-tertiary/50 group-hover:backdrop-blur",
            "group-focus:bg-tertiary/50 group-focus:backdrop-blur",
            "invisible transition-all group-hover:visible group-focus:visible",
            "flex flex-col items-start justify-center gap-2",
          )}
        >
          {icon ? (
            <img
              src={icon}
              alt={title}
              className="mb-2 h-12 rounded object-contain"
            />
          ) : null}
          <strong className="white text-2xl font-bold">{title}</strong>
          {subtitle ? <p className="white font-semibold">{subtitle}</p> : null}
          {showDescription ? (
            <p className="white hidden text-base italic sm:block">
              {description}
            </p>
          ) : null}
        </div>
      </article>
    </Link>
  )
}
