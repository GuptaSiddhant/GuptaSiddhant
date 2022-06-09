import { Form, useSubmit } from "@remix-run/react"
import clsx from "clsx"
import FilterIcon from "remixicon-react/Filter3LineIcon"
import GridIcon from "remixicon-react/GridLineIcon"
import ListIcon from "remixicon-react/ListUnorderedIcon"
import SortIcon from "remixicon-react/SortDescIcon"

import RadioGroup from "~/packages/components/RadioGroup"
import Select from "~/packages/components/Select"
import { capitalize } from "~/packages/helpers/format"

export interface FilterSortFormProps {
  sortBy?: string
  tags?: { value: string; occurrence: number }[]
  selectedTag?: string
  viewAs?: string
}

export default function FilterSortForm({
  sortBy,
  tags = [],
  selectedTag,
  viewAs,
}: FilterSortFormProps): JSX.Element | null {
  const submit = useSubmit()
  const formId = "projects-filter-sort"

  return (
    <Form
      onChange={(e) => submit(e.currentTarget)}
      id={formId}
      className={clsx(
        "grid grid-flow-row-dense gap-4 items-center",
        "grid-cols-2 sm:grid-cols-4",
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
        className="col-span-2"
        onClear={(selectRef) => {
          if (selectRef.current) {
            selectRef.current.value = ""
            submit(selectRef.current.form)
          }
        }}
      >
        <Select.Option value="">All</Select.Option>
        {tags.map((tag) => (
          <Select.Option key={tag.value} value={tag.value}>
            {capitalize(tag.value)} ({tag.occurrence})
          </Select.Option>
        ))}
      </Select>

      <RadioGroup
        className="flex"
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
