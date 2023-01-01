import { useFetcher } from "@remix-run/react";

import Dialog from "../ui/Dialog";
import useSearch from ".";
import { useCommands } from "./commands";
import SearchInput from "./SearchInput";
import SearchOutput, { type SearchOutputData } from "./SearchOutput";
import useSearchKeyDown from "./useSearchKeyDown";

export default function SearchDialog({
  dialogRef,
}: {
  dialogRef: React.RefObject<HTMLDialogElement>;
}): JSX.Element | null {
  const { isSearchOpen, closeSearch } = useSearch();

  const handleSearchKeyDown = useSearchKeyDown();
  const fetcher = useFetcher<SearchOutputData>();
  const commands = useCommands();

  return (
    <Dialog
      id="search"
      isOpen={isSearchOpen}
      dialogRef={dialogRef}
      closeDialog={closeSearch}
      className="flex h-[90vh] flex-col gap-4 lg:h-[60vh]"
      onKeyDown={handleSearchKeyDown}
    >
      <SearchInput {...fetcher} />
      <SearchOutput
        data={fetcher.data}
        commands={commands}
        query={fetcher.submission?.formData.get("query")?.toString()}
      />
    </Dialog>
  );
}
