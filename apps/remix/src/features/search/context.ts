import { createContext, useContext } from "react";

import invariant from "@gs/utils/invariant";

export interface SearchContextValue {
  isSearchOpen: boolean;
  inputValue: string;
  changeInputValue: (value: string) => void;
  toggleSearchOpen: () => void;
  openSearch: () => void;
  closeSearch: () => void;
  openSearchWithInput: (input: string) => void;
  inputRef: React.RefObject<HTMLInputElement>;
  resultsRef: React.RefObject<HTMLDivElement>;
}

export const SearchContext = createContext<SearchContextValue | undefined>(
  undefined,
);

export default function useSearch(): SearchContextValue {
  const context = useContext(SearchContext);
  invariant(context, "useSearch must be used within a Search Provider.");

  return context;
}
