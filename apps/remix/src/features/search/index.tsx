import { startTransition, useRef, useState } from "react";

import useStableCallback from "@gs/hooks/useStableCallback";

import { useDialog } from "../ui/Dialog";
import SearchDialog from "./SearchDialog";
import useSearch, { SearchContext, SearchContextValue } from "./context";

export default function Search({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element | null {
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const [inputValue, setInputValue] = useState("");

  const {
    dialogRef,
    closeDialog: closeSearch,
    isOpen: isSearchOpen,
    openDialog: openSearch,
    toggleDialogOpen: toggleSearchOpen,
  } = useDialog({
    onDialogOpen: () => inputRef.current?.focus(),
    onDialogClose: () => {
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    },
  });

  const openSearchWithInput = useStableCallback((input: string) => {
    openSearch();
    startTransition(() => setInputValue(input));
  });

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
  );
}

export { useSearch };
export type { SearchContextValue };
