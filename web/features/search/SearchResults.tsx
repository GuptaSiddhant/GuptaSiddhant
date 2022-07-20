import { Link } from "@remix-run/react"
import clsx from "clsx"
import { useState } from "react"

// import type { AboutInfo, Skills } from "../about"
import type { ExperienceProps } from "../experiences/types"
import type { TeaserProps } from "../teaser"
import type { Gallery } from "../types"
import Accordion from "../ui/Accordion"
import Mdx from "../ui/Mdx"
import Tags from "../ui/Tags"
import useSearch from "."

type Enriched<T> = T & { linkUrl?: string }

export interface SearchResultsData {
  // about: AboutInfo
  // skills: Skills
  projects: Enriched<TeaserProps>[]
  blog: Enriched<TeaserProps>[]
  career: Enriched<ExperienceProps>[]
  education: Enriched<ExperienceProps>[]
}

export default function SearchResults({
  data,
  query,
  resultsRef,
}: {
  data?: SearchResultsData
  query?: string
  resultsRef: React.RefObject<HTMLDivElement>
}): JSX.Element | null {
  const [previewContent, setPreviewContent] = useState<
    React.ReactNode | undefined
  >(undefined)

  if (!data && !query) return null

  if (!data) {
    return (
      <output className="flex-1 border-t border-divider pt-4 text-disabled flex-center">
        No results found
      </output>
    )
  }

  const { projects, blog, career, education } = data

  return (
    <output
      className={clsx(
        "grid flex-1 gap-2 overflow-hidden border-t border-divider pt-4 md:grid-cols-2",
      )}
    >
      <div
        id="search-results"
        className="flex flex-col gap-2 overflow-y-auto overflow-x-hidden"
        ref={resultsRef}
      >
        <SearchResultGroup
          label="Projects"
          items={projects}
          setPreviewContent={setPreviewContent}
        />
        <SearchResultGroup
          label="Blog"
          items={blog}
          setPreviewContent={setPreviewContent}
        />
        <SearchResultGroup
          label="Career"
          items={career}
          setPreviewContent={setPreviewContent}
        />
        <SearchResultGroup
          label="Education"
          items={education}
          setPreviewContent={setPreviewContent}
        />
      </div>

      <div
        id="search-result-preview"
        className={clsx(
          "overflow-y-auto border-l border-divider pl-4",
          previewContent ? "flex flex-col gap-2" : "flex-center",
        )}
      >
        {previewContent || (
          <span className="text-base text-disabled">
            Hover/Focus a result to see its preview.
          </span>
        )}
      </div>
    </output>
  )
}

interface SearchResultGroupProps {
  label: string
  items: SearchResultItemProps[]
  setPreviewContent: (content: React.ReactNode) => void
}

function SearchResultGroup({
  label,
  items,
  setPreviewContent,
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
          setPreviewContent={setPreviewContent}
        />
      ))}
    </Accordion>
  )
}

interface SearchResultItemProps {
  id: string
  title: string
  subtitle?: string
  icon?: string
  cover?: string
  linkUrl?: string
  tags?: string[]
  gallery?: Gallery
  description?: string
  setPreviewContent?: (content: React.ReactNode) => void
}

function SearchResultItem({
  setPreviewContent,
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
      onMouseEnter={() =>
        setPreviewContent?.(<SearchResultItemPreview {...props} />)
      }
      onFocus={() =>
        setPreviewContent?.(<SearchResultItemPreview {...props} />)
      }
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

function SearchResultItemPreview({
  title,
  icon,
  id,
  cover,
  subtitle,
  tags = [],
  description,
  ...props
}: SearchResultItemProps): JSX.Element {
  const heroImageUrl = cover || props.gallery?.[0]?.url

  return (
    <>
      {heroImageUrl ? (
        <img
          src={heroImageUrl}
          alt={id}
          className="mb-4 aspect-video w-full object-cover"
        />
      ) : icon ? (
        <img
          src={icon}
          alt={id}
          className="mb-4 h-16 w-16 rounded bg-inverse object-cover"
        />
      ) : null}
      <div className="text-2xl font-bold">{title}</div>
      <div className="text-xl font-semibold text-secondary">{subtitle}</div>
      <Tags.List tags={tags} />

      <div className={clsx("border-b border-divider")} />

      {description ? <Mdx mdx={description} /> : null}
    </>
  )
}
