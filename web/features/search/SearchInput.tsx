import { useTransition } from "react"

import type { FetcherWithComponents } from "@remix-run/react"

import { CloseIcon, LoadingIcon } from "@gs/icons"
import Button from "@gs/ui/Button"
import Input from "@gs/ui/Input"

import useSearch from "."
import SearchIcon from "./SearchButton"

export default function SearchInput({
  Form,
  submit,
  state,
}: FetcherWithComponents<any>): JSX.Element | null {
  const { closeSearch, inputRef } = useSearch()
  const [isPending, startTransition] = useTransition()
  const isLoading = state === "submitting" || state === "loading" || isPending

  return (
    <Form
      className="relative flex w-full gap-2"
      method="get"
      action="/search"
      onChange={(e) => startTransition(() => submit(e.currentTarget))}
    >
      <Input
        id="search-input"
        name="query"
        labelClassName="flex-1"
        className="h-10 w-full pl-10"
        type="search"
        placeholder="Search..."
        inputRef={inputRef}
        autoFocus
        autoComplete="off"
        enterKeyHint="search"
        onChange={console.log}
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
