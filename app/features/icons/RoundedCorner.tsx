import clsx from "clsx"

export default function RoundedCorner({
  className,
  size = 16,
}: {
  className?: string
  size?: number
}) {
  return (
    <svg
      width={`${size}`}
      height={`${size}`}
      viewBox={`0 0 ${size} ${size}`}
      xmlns="http://www.w3.org/2000/svg"
      className={clsx(className, "absolute z-layout fill-black")}
      role="presentation"
    >
      <path d="M16 0H0V16C0 7.16344 7.16344 0 16 0Z" />
    </svg>
  )
}
