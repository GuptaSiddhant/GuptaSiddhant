import clsx from "clsx"

const topLeft = clsx("top-full left-4 rotate-0")
const topRight = clsx("top-full right-4 rotate-90")
const bottomLeft = clsx("bottom-full left-4 -rotate-90")
const bottomRight = clsx("bottom-full right-4 rotate-180")

export default function RoundedCorner({
  bottom,
  right,
}: {
  bottom?: boolean
  right?: boolean
}) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      xmlns="http://www.w3.org/2000/svg"
      className={clsx(
        "absolute z-40 fill-black",
        bottom
          ? right
            ? bottomRight
            : bottomLeft
          : right
          ? topRight
          : topLeft,
      )}
      role="presentation"
    >
      <path d="M16 0H0V16C0 7.16344 7.16344 0 16 0Z" />
    </svg>
  )
}
