import { createContext, useContext, useRef } from "react"
import invariant from "tiny-invariant"

import { useDialog } from "../ui/Dialog"
import SearchDialog from "./SearchDialog"

export interface SearchContextValue {
  isSearchOpen: boolean
  toggleSearchOpen: () => void
  openSearch: () => void
  closeSearch: () => void
  inputRef: React.RefObject<HTMLInputElement>
  resultsRef: React.RefObject<HTMLDivElement>
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

  const inputRef = useRef<HTMLInputElement>(null)
  const resultsRef = useRef<HTMLDivElement>(null)

  return (
    <SearchContext.Provider
      value={{
        closeSearch,
        isSearchOpen,
        openSearch,
        toggleSearchOpen,
        inputRef,
        resultsRef,
      }}
    >
      {children}
      <SearchDialog dialogRef={dialogRef} />
    </SearchContext.Provider>
  )
}