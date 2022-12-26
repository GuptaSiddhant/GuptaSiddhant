import clsx from "clsx";
import FilterIcon from "remixicon-react/Filter3LineIcon";
import GridIcon from "remixicon-react/GridLineIcon";
import ListIcon from "remixicon-react/ListUnorderedIcon";
import SortIcon from "remixicon-react/SortDescIcon";

import { Form, useSubmit } from "@remix-run/react";

import type { UniqueTag } from "@gs/helpers/filter";
import RadioGroup from "@gs/ui/RadioGroup";
import Select from "@gs/ui/Select";
import { capitalize } from "@gs/utils/format";

import { SortByOption, ViewAsOption } from ".";

export interface SummaryFilterSortFormProps {
  filterPlaceholder?: string;
  selectedTag: string;
  sortBy: SortByOption;
  viewAs: ViewAsOption;
  tags: UniqueTag[];
}

export default function SummaryFilterSortForm({
  sortBy,
  tags = [],
  selectedTag,
  viewAs,
  filterPlaceholder = "All",
}: SummaryFilterSortFormProps): JSX.Element | null {
  const submit = useSubmit();
  const formId = "projects-filter-sort";

  return (
    <Form
      onChange={(e) => submit(e.currentTarget)}
      id={formId}
      className={clsx(
        "grid grid-flow-row-dense items-center gap-4",
        "sm:grid-cols-2 md:grid-cols-[1fr_2fr_1fr]",
      )}
    >
      <Select
        name="sort"
        defaultValue={sortBy}
        title="Sort by"
        label={<SortIcon className="scale-90" />}
      >
        <Select.Option value={SortByOption.Latest}>Latest first</Select.Option>
        <Select.Option value={SortByOption.Oldest}>Oldest first</Select.Option>
        <Select.Option value={SortByOption.Featured}>
          Featured first
        </Select.Option>
      </Select>

      <Select
        name="tag"
        defaultValue={selectedTag}
        title="Filter by tag"
        label={<FilterIcon className="scale-90" />}
        onClear={(selectRef) => {
          if (selectRef.current) {
            selectRef.current.value = "";
            submit(selectRef.current.form);
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
          {
            value: ViewAsOption.Grid,
            label: <GridIcon />,
            title: "View as grid",
          },
          {
            value: ViewAsOption.Timeline,
            label: <ListIcon />,
            title: "View as list",
          },
        ]}
      />
    </Form>
  );
}
