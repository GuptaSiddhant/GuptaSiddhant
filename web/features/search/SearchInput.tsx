import type { FetcherWithComponents } from "@remix-run/react"

import { CloseIcon, LoadingIcon } from "../icons"
import Button from "../ui/Button"
import Input from "../ui/Input"
import useSearch from "."
import { SearchIcon } from "./SearchButton"

export default function SearchInput({
  Form,
  submit,
  state,
  inputRef,
}: FetcherWithComponents<any> & {
  inputRef: React.RefObject<HTMLInputElement>
}): JSX.Element | null {
  const { closeSearch } = useSearch()
  const isLoading = state === "submitting" || state === "loading"

  return (
    <Form
      className="relative flex w-full gap-2"
      method="get"
      action="/search"
      onChange={(e) => submit(e.currentTarget)}
    >
      <Input
        id="search-input"
        name="query"
        labelClassName="flex-1"
        className="h-10 w-full pl-10"
        type="search"
        placeholder="Search for anything..."
        inputRef={inputRef}
        autoFocus
        autoComplete="off"
      />

      <label
        role={"presentation"}
        className="absolute left-2 top-1/2 -translate-y-1/2 text-disabled flex-center"
        htmlFor="search-input"
        title="Search"
      >
        {isLoading ? <LoadingIcon className="animate-spin" /> : <SearchIcon />}
      </label>

      <Button.Secondary
        title="Close search"
        onClick={closeSearch}
        className="!px-2"
      >
        <CloseIcon />
        <span className="sr-only">Close</span>
      </Button.Secondary>
    </Form>
  )
}
