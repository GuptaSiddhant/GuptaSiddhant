import clsx from "clsx"

import { Link } from "@remix-run/react"

// import type { AboutInfo, Skills } from "../about"
import type { Gallery } from "../types"
import Accordion from "../ui/Accordion"
import useSearch from "."

export interface SearchResultGroupProps {
  label: string
  items?: SearchResultItemProps[]
  setPreviewProps: (content: SearchResultItemProps) => void
}

export function SearchResultGroup({
  label,
  items = [],
  setPreviewProps,
}: SearchResultGroupProps): JSX.Element | null {
  if (items.length === 0) return null
  return (
    <Accordion
      summary={<strong>{label}</strong>}
      open
      summaryClassName="sticky top-0"
      className="flex flex-col gap-4"
    >
      {items.map((item) => (
        <SearchResultItem
          key={item.id}
          {...item}
          setPreviewProps={setPreviewProps}
        />
      ))}
    </Accordion>
  )
}

export interface SearchResultItemProps {
  id: string
  title: string
  subtitle?: string
  icon?: string
  cover?: string
  linkUrl?: string
  tags?: string[]
  gallery?: Gallery
  description?: string
  setPreviewProps?: (content: SearchResultItemProps) => void
}

export function SearchResultItem({
  setPreviewProps,
  ...props
}: SearchResultItemProps): JSX.Element | null {
  const { id, title, subtitle, icon, cover, linkUrl } = props
  const to = new URL(linkUrl || id)
  const { closeSearch } = useSearch()

  return (
    <Link
      to={to}
      id={`search-result-${id}`}
      className={clsx(
        "mx-2 grid grid-cols-[2rem_1fr] items-center gap-4 py-2 px-4 ",
        "rounded bg-transparent hocus:bg-secondary",
      )}
      onClick={closeSearch}
      onMouseEnter={() => setPreviewProps?.(props)}
      onFocus={() => setPreviewProps?.(props)}
    >
      <div className="h-8 w-8">
        {icon || cover ? (
          <img
            src={icon || cover}
            alt={id}
            className="h-full w-full rounded-sm bg-inverse object-cover"
            loading="lazy"
          />
        ) : null}
      </div>
      <div className="flex flex-col">
        <span className="text-base font-bold">{title}</span>
        <span className="text-sm">{subtitle}</span>
      </div>
    </Link>
  )
}
