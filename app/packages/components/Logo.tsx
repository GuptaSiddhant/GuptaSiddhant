import { Link } from "react-router-dom"

export default function Logo(): JSX.Element | null {
  return (
    <Link
      to="/"
      className={"select-none text-ellipsis overflow-hidden whitespace-nowrap"}
    >
      <span
        role="presentation"
        className={
          "text-xl font-black uppercase leading-normal tracking-widest text-primary"
        }
      >
        Siddhant Gupta
      </span>
    </Link>
  )
}
