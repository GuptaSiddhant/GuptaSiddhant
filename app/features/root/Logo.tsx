import { Link } from "@remix-run/react"

export default function Logo(): JSX.Element | null {
  return (
    <Link
      to="/"
      className={"select-none overflow-hidden text-ellipsis whitespace-nowrap"}
      translate="no"
    >
      <span
        className={
          "hidden text-xl font-black uppercase leading-normal tracking-widest text-primary sm:block"
        }
      >
        Siddhant Gupta
      </span>
      <span
        className={
          "text-3xl font-black uppercase leading-none tracking-widest text-primary sm:hidden"
        }
      >
        GS
      </span>
    </Link>
  )
}
