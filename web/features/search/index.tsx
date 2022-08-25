import {
  createContext,
  startTransition,
  useContext,
  useRef,
  useState,
} from "react"

import useStableCallback from "@gs/hooks/useStableCallback"
import invariant from "@gs/utils/invariant"

import { useDialog } from "../ui/Dialog"
import SearchDialog from "./SearchDialog"

export interface SearchContextValue {
  isSearchOpen: boolean
  inputValue: string
  changeInputValue: (value: string) => void
  toggleSearchOpen: () => void
  openSearch: () => void
  closeSearch: () => void
  openSearchWithInput: (input: string) => void
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
  const inputRef = useRef<HTMLInputElement>(null)
  const resultsRef = useRef<HTMLDivElement>(null)
  const [inputValue, setInputValue] = useState("")

  const {
    dialogRef,
    closeDialog: closeSearch,
    isOpen: isSearchOpen,
    openDialog: openSearch,
    toggleDialogOpen: toggleSearchOpen,
  } = useDialog({
    onDialogOpen: () => inputRef.current?.focus(),
    onDialogClose: () => {
      if (inputRef.current) inputRef.current.value = ""
    },
  })

  const openSearchWithInput = useStableCallback((input: string) => {
    openSearch()
    startTransition(() => setInputValue(input))
  })

  return (
    <SearchContext.Provider
      value={{
        closeSearch,
        isSearchOpen,
        openSearch,
        toggleSearchOpen,
        inputRef,
        resultsRef,
        openSearchWithInput,
        inputValue,
        changeInputValue: setInputValue,
      }}
    >
      {children}
      <SearchDialog dialogRef={dialogRef} />
    </SearchContext.Provider>
  )
}
