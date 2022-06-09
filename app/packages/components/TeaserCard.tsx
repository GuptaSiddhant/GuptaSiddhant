import clsx from "clsx"

import { Link } from "~/packages/components/Link"
import type { TeaserProps } from "~/packages/helpers/teaser"

export interface TeaserCardProps extends TeaserProps {
  linkBaseUrl: string
  className?: string
  small?: boolean
}

export default function TeaserCard({
  id,
  title,
  cover,
  linkBaseUrl,
  className,
  small,
}: TeaserCardProps): JSX.Element {
  return (
    <Link to={linkBaseUrl + id} className="group" prefetch="intent">
      <li
        className={clsx(
          className,
          "relative overflow-hidden rounded-lg shadow-xl",
          "bg-secondary bg-cover bg-center bg-no-repeat",
          "aspect-[3/4] h-72",
          small ? "" : "sm:h-96",
        )}
        style={{ backgroundImage: `url(${cover})` }}
      >
        <div
          className={clsx(
            "absolute bottom-0 left-0 right-0",
            "bg-gradient-to-t from-gray-900 to-transparent",
            "p-4 transition-[padding] duration-300 group-hover:py-8 group-focus:py-8",
          )}
        >
          <span className={"text-shadow text-2xl font-bold"}>{title}</span>
        </div>
      </li>
    </Link>
  )
}
