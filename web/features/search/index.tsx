import { useFetcher } from "@remix-run/react"
import clsx from "clsx"
import React, { createContext, useContext } from "react"
import invariant from "tiny-invariant"

import Dialog, { useDialog } from "../ui/Dialog"
import SearchInput from "./SearchInput"
import SearchResults, { type SearchResultsData } from "./SearchResults"
import useSearchShortcuts from "./useSearchShortcuts"

export interface SearchContextValue {
  isSearchOpen: boolean
  toggleSearchOpen: () => void
  openSearch: () => void
  closeSearch: () => void
}

const SearchContext = createContext<SearchContextValue | undefined>(undefined)

export default function useSearch(): SearchContextValue {
  const context = useContext(SearchContext)
  invariant(context, "useSearch must be used within a Search Provider.")

  return context
}

export function Search({
  children,
}: {
  children: React.ReactNode
}): JSX.Element | null {
  const {
    dialogRef,
    closeDialog: closeSearch,
    isOpen: isSearchOpen,
    openDialog: openSearch,
    toggleDialogOpen: toggleSearchOpen,
  } = useDialog()

  return (
    <SearchContext.Provider
      value={{ closeSearch, isSearchOpen, openSearch, toggleSearchOpen }}
    >
      {children}
      <SearchDialog dialogRef={dialogRef} />
    </SearchContext.Provider>
  )
}

function SearchDialog({
  dialogRef,
}: {
  dialogRef: React.RefObject<HTMLDialogElement>
}): JSX.Element | null {
  useSearchShortcuts()
  const { isSearchOpen, closeSearch } = useSearch()
  const fetcher = useFetcher<SearchResultsData>()

  return (
    <Dialog
      id="search"
      isOpen={isSearchOpen}
      dialogRef={dialogRef}
      closeDialog={closeSearch}
      className="flex max-h-[75vh] flex-col gap-4"
    >
      <SearchInput {...fetcher} />
      <SearchResults
        data={fetcher.data}
        query={fetcher.submission?.formData.get("query")?.toString()}
      />
    </Dialog>
  )
}
