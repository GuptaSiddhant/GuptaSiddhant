import { Form, useSubmit } from "@remix-run/react"
import clsx from "clsx"
import FilterIcon from "remixicon-react/Filter3LineIcon"
import GridIcon from "remixicon-react/GridLineIcon"
import ListIcon from "remixicon-react/ListUnorderedIcon"
import SortIcon from "remixicon-react/SortDescIcon"

import { capitalize } from "~/features/helpers/format"
import RadioGroup from "~/features/ui/RadioGroup"
import Select from "~/features/ui/Select"

import type { FilterSortTeasersReturn } from "./filter-sort"

export interface TeaserFilterSortFormProps
  extends Omit<FilterSortTeasersReturn, "teasers"> {
  filterPlaceholder?: string
}

export default function TeaserFilterSortForm({
  sortBy,
  tags = [],
  selectedTag,
  viewAs,
  filterPlaceholder = "All",
}: TeaserFilterSortFormProps): JSX.Element | null {
  const submit = useSubmit()
  const formId = "projects-filter-sort"

  return (
    <Form
      onChange={(e) => submit(e.currentTarget)}
      id={formId}
      className={clsx(
        "grid grid-flow-row-dense gap-4 items-center",
        "sm:grid-cols-2 md:grid-cols-[1fr_2fr_1fr]",
      )}
    >
      <Select
        name="sort"
        value={sortBy}
        title="Sort by"
        label={<SortIcon className="scale-90" />}
      >
        <Select.Option value="latest">Latest first</Select.Option>
        <Select.Option value="oldest">Oldest first</Select.Option>
        <Select.Option value="featured">Featured</Select.Option>
      </Select>

      <Select
        name="tag"
        value={selectedTag}
        title="Filter by tag"
        label={<FilterIcon className="scale-90" />}
        onClear={(selectRef) => {
          if (selectRef.current) {
            selectRef.current.value = ""
            submit(selectRef.current.form)
          }
        }}
      >
        <Select.Option value="">{filterPlaceholder}</Select.Option>
        <Select.Group label="Filter by tag" />
        {tags.map((tag) => (
          <Select.Option key={tag.value} value={tag.value}>
            {capitalize(tag.value)} ({tag.occurrence})
          </Select.Option>
        ))}
      </Select>

      <RadioGroup
        className="hidden md:flex"
        name="view"
        value={viewAs}
        options={[
          { value: "grid", label: <GridIcon />, title: "View as grid" },
          { value: "list", label: <ListIcon />, title: "View as list" },
        ]}
      />
    </Form>
  )
}
