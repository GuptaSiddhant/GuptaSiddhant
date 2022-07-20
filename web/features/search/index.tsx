import { useFetcher } from "@remix-run/react"
import React, { createContext, useContext, useEffect, useRef } from "react"
import invariant from "tiny-invariant"

import Dialog, { useDialog } from "../ui/Dialog"
import SearchInput from "./SearchInput"
import SearchResults, { type SearchResultsData } from "./SearchResults"
import useSearchKeyDown from "./useSearchKeyDown"

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
  const { isSearchOpen, closeSearch } = useSearch()
  const inputRef = useRef<HTMLInputElement>(null)
  const resultsRef = useRef<HTMLDivElement>(null)

  const fetcher = useFetcher<SearchResultsData>()
  const load = fetcher.load

  useSearchKeyDown(inputRef, resultsRef)
  useEffect(() => {
    if (isSearchOpen) {
      inputRef.current?.form?.reset()
      inputRef.current?.focus()
      load("/search")
    }
  }, [isSearchOpen, load])

  return (
    <Dialog
      id="search"
      isOpen={isSearchOpen}
      dialogRef={dialogRef}
      closeDialog={closeSearch}
      className="flex h-[90vh] flex-col gap-4 lg:h-[60vh]"
    >
      <SearchInput {...fetcher} inputRef={inputRef} />
      <SearchResults
        resultsRef={resultsRef}
        data={fetcher.data}
        query={fetcher.submission?.formData.get("query")?.toString()}
      />
    </Dialog>
  )
}
