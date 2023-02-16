import clsx from "clsx";
import { useMemo, useState } from "react";

import {
  assetTransformationOptions,
  generateAssetTransformedUrl,
} from "@gs/helpers/assets";
import type { SummaryItem } from "@gs/summary";
import Mdx from "@gs/ui/Mdx";
import Tags from "@gs/ui/Tags";

import {
  CommandItem,
  SearchResultGroup,
  type SearchResultItemProps,
} from "./SearchResult";
import type { Command } from "./commands";
import useSearch from "./context";

export interface SearchOutputData {
  projects?: SummaryItem[];
  blog?: SummaryItem[];
  career?: SummaryItem[];
  education?: SummaryItem[];
}

export default function SearchOutput({
  data,
  commands,
}: {
  data?: SearchOutputData;
  query?: string;
  commands: Command[];
}): JSX.Element | null {
  const { resultsRef, inputValue } = useSearch();

  const cmdMode = useMemo(() => inputValue.startsWith(">"), [inputValue]);

  const [previewProps, setPreviewProps] = useState<
    SearchResultItemProps | undefined
  >(undefined);

  if (cmdMode) {
    return (
      <output
        ref={resultsRef as unknown as React.RefObject<HTMLOutputElement>}
        className="flex h-auto flex-col gap-2 overflow-y-auto overflow-x-hidden p-2"
      >
        {commands.map((command) => (
          <CommandItem key={command.id} {...command} />
        ))}
      </output>
    );
  }

  if (isDataEmpty(data)) {
    return (
      <output className="flex-1 border-t border-divider pt-4 text-disabled flex-center">
        No results found
      </output>
    );
  }

  const { projects, blog, career, education } = data!;

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
  );
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
  const heroImageUrl = generateAssetTransformedUrl(
    cover || props.gallery?.[0]?.url,
    {
      aspectRatio: 16 / 9,
      width: 500,
    },
  );
  const iconUrl = generateAssetTransformedUrl(
    icon,
    assetTransformationOptions.ICON,
  );

  return (
    <>
      {heroImageUrl ? (
        <img
          src={heroImageUrl}
          alt={id}
          className="mb-4 aspect-video min-h-[200px] w-full overflow-hidden rounded object-cover"
        />
      ) : iconUrl ? (
        <img
          src={iconUrl}
          alt={id}
          className="mb-4 min-h-[4rem] w-16 overflow-hidden rounded bg-inverse object-cover"
        />
      ) : null}
      <div className="text-2xl font-bold">{title}</div>
      <div className="text-xl font-semibold text-secondary">{subtitle}</div>
      <Tags.List tags={tags} />

      <div className={clsx("border-b border-divider")} />

      {description ? <Mdx mdx={description} /> : null}
    </>
  );
}

function isDataEmpty(data?: SearchOutputData): boolean {
  if (!data) {
    return true;
  }
  if (typeof data !== "object") {
    return true;
  }

  const values = Object.values(data);

  if (values.length === 0) {
    return true;
  }
  if (values.every((value) => !Array.isArray(value) || value.length === 0)) {
    return true;
  }

  return false;
}
