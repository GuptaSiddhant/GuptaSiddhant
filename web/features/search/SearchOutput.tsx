import clsx from "clsx"
import { useState } from "react"

// import type { AboutInfo, Skills } from "../about"
import type { ExperienceProps } from "../experiences/types"
import type { TeaserProps } from "../teaser"
import Mdx from "../ui/Mdx"
import Tags from "../ui/Tags"
import useSearch from "."
import { type SearchResultItemProps, SearchResultGroup } from "./SearchResult"

type Enriched<T> = T & { linkUrl?: string }

export interface SearchOutputData {
  // about: AboutInfo
  // skills: Skills
  projects?: Enriched<TeaserProps>[]
  blog?: Enriched<TeaserProps>[]
  career?: Enriched<ExperienceProps>[]
  education?: Enriched<ExperienceProps>[]
}

export default function SearchOutput({
  data,
  query,
}: {
  data?: SearchOutputData
  query?: string
}): JSX.Element | null {
  const { resultsRef } = useSearch()

  const [previewProps, setPreviewProps] = useState<
    SearchResultItemProps | undefined
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
          setPreviewProps={setPreviewProps}
        />
        <SearchResultGroup
          label="Blog"
          items={blog}
          setPreviewProps={setPreviewProps}
        />
        <SearchResultGroup
          label="Career"
          items={career}
          setPreviewProps={setPreviewProps}
        />
        <SearchResultGroup
          label="Education"
          items={education}
          setPreviewProps={setPreviewProps}
        />
      </div>

      <div
        id="search-result-preview"
        className={clsx(
          "hidden md:flex",
          "overflow-y-auto border-l border-divider pl-4",
          previewProps ? "flex-col gap-2" : "flex-center",
        )}
      >
        {previewProps ? (
          <SearchOutputPreview {...previewProps} />
        ) : (
          <span className="text-base text-disabled">
            Hover/Focus a result to see its preview.
          </span>
        )}
      </div>
    </output>
  )
}

function SearchOutputPreview({
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
          className="mb-4 aspect-video w-full overflow-hidden object-cover"
        />
      ) : icon ? (
        <img
          src={icon}
          alt={id}
          className="mb-4 h-16 w-16 overflow-hidden rounded bg-inverse object-cover"
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
