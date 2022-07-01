import { Form, useSubmit } from "@remix-run/react"
import clsx from "clsx"
import FilterIcon from "remixicon-react/Filter3LineIcon"

import type { TocItem } from "~/features/helpers/table-of-contents"
import Reader from "~/features/ui/Reader"
import { proseWidth } from "~/features/ui/Section"

import { capitalize } from "../helpers/format"
import Button from "../ui/Button"
import Select from "../ui/Select"
import TableOfContent from "../ui/TableOfContent"
import Tags from "../ui/Tags"
import type { LifeLineCategory, LifeLineItems } from "."
import CareerCard from "./CareerCard"
import { LifelineContextProvider } from "./context"
import EducationCard from "./EducationCard"
import LifelineDivider from "./LifelineDivider"

export interface LifelineProps {
  lifeline: LifeLineItems
  toc?: TocItem[]
  tags?: string[]
  selectedTags?: string[]
  selectedCategory: LifeLineCategory
}

export default function Lifeline({
  lifeline,
  toc = [],
  tags = [],
  selectedTags = [],
  selectedCategory,
}: LifelineProps): JSX.Element | null {
  return (
    <LifelineContextProvider>
      <Reader
        id="lifeline"
        className={clsx(
          proseWidth,
          "md:!min-w-0",
          "flex w-full flex-col gap-12 border-l border-divider py-12 pl-4",
        )}
        rightColumn={<TableOfContent toc={toc} />}
        leftColumn={
          <LifelineFilter
            tags={tags}
            selectedTags={selectedTags}
            selectedCategory={selectedCategory}
          />
        }
      >
        {lifeline.map((item) => {
          if ("degree" in item) return <EducationCard key={item.id} {...item} />
          if ("position" in item) return <CareerCard key={item.id} {...item} />
          return <LifelineDivider key={item.id} {...item} />
        })}
      </Reader>
    </LifelineContextProvider>
  )
}

interface LifelineFilterProps {
  tags: string[]
  selectedTags: string[]
  selectedCategory: LifeLineCategory
}

function LifelineFilter({
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
