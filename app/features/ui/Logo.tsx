import { Link } from "@remix-run/react"

export default function Logo(): JSX.Element | null {
  return (
    <Link
      to="/"
      className={"select-none overflow-hidden text-ellipsis whitespace-nowrap"}
    >
      <span
        role="presentation"
        translate="no"
        className={
          "text-xl font-black uppercase leading-normal tracking-widest text-primary"
        }
      >
        Siddhant Gupta
      </span>
    </Link>
  )
}
