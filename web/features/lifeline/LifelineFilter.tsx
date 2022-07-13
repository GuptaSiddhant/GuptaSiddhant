import Button from "@gs/ui/Button"
import Select from "@gs/ui/Select"
import Tags from "@gs/ui/Tags"
import { Form, useSubmit } from "@remix-run/react"
import clsx from "clsx"
import FilterIcon from "remixicon-react/Filter3LineIcon"

import { capitalize } from "@gs/utils/format"

import type { LifeLineCategory } from "."

export interface LifelineFilterProps {
  tags: string[]
  selectedTags: string[]
  selectedCategory: LifeLineCategory
}

export default function LifelineFilter({
  tags = [],
  selectedTags = [],
  selectedCategory,
}: LifelineFilterProps): JSX.Element | null {
  const submit = useSubmit()

  if (tags.length === 0) return null

  return (
    <Form
      onChange={(e) => submit(e.currentTarget)}
      className="flex flex-col gap-4 px-4 py-8 md:w-52 md:py-0 md:px-8"
    >
      <Select
        label={<FilterIcon className="scale-90" />}
        name="category"
        value={selectedCategory}
      >
        <Select.Option value={""}>All</Select.Option>
        {["career", "education"].map((category) => (
          <Select.Option key={category} value={category}>
            {capitalize(category)}
          </Select.Option>
        ))}
      </Select>

      <Tags.List
        className="md:flex-col md:items-start "
        tags={tags}
        TagComponent={({ tag }) => (
          <Tags.Checkbox
            label={tag}
            value={tag.toLowerCase()}
            name="tags"
            defaultChecked={selectedTags.includes(tag.toLowerCase())}
          />
        )}
        suffixElement={
          <Button
            type="reset"
            onClick={() => submit({ tags: "" })}
            className={clsx(selectedTags.length === 0 && "hidden")}
          >
            × Reset tags
          </Button>
        }
      />
    </Form>
  )
}
