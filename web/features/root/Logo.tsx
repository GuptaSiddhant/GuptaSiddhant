import { useRef } from "react"

import { Link, useLoaderData, useNavigate } from "@remix-run/react"

import useLongPress from "@gs/hooks/useLongPress"

import type { RootLoaderData } from "."

export default function Logo(): JSX.Element | null {
  const ref = useRef<HTMLAnchorElement>(null)
  const navigate = useNavigate()
  const data = useLoaderData<RootLoaderData | undefined>()

  useLongPress(ref, () => navigate("/admin"))

  const name = data?.about.name || "Siddhant Gupta"
  const shortName = data?.about.shortName || "GS"

  return (
    <Link
      to="/"
      className={"select-none overflow-hidden text-ellipsis whitespace-nowrap"}
      translate="no"
      ref={ref}
    >
      <span
        className={
          "hidden text-xl font-black uppercase leading-normal tracking-widest text-primary sm:block"
        }
      >
        {name}
      </span>
      <span
        className={
          "text-3xl font-black uppercase leading-none tracking-widest text-primary sm:hidden"
        }
      >
        {shortName}
      </span>
    </Link>
  )
}
