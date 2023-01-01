import open from "open"

import useWindowSize from "../helpers/useWindowSize"
import type { PageProps } from "../types"
import ErrorText from "./Error"
import HelpBox from "./HelpBox"
import Loading from "./Loading"
import type { Item } from "./Select"
import Select from "./Select"

export default function Page<T extends { id: string; linkUrl?: string }>({
  queryFn,
  Item,
}: PageProps<T>): JSX.Element | null {
  const { data, loading, error } = queryFn()
  const { height = 16 } = useWindowSize()

  if (loading) return <Loading />
  if (error) return <ErrorText error={error} />
  if (!data || !Array.isArray(data) || data.length === 0) return null

  const items = data.map((item, i) => ({ item, key: i.toString() }))
  const limit = Math.floor((height - 16) / 4)

  const handleSelect = ({ item }: Item<T>) => {
    if (item.linkUrl) open(item.linkUrl)
  }

  return (
    <>
      <Select
        isFocused
        items={items}
        limit={limit}
        ItemComponent={Item}
        onSelect={handleSelect}
      />

      {/* Footer */}
      <HelpBox
        {...{
          "↕": `Scroll with up/down arrow keys (total: ${items.length}).`,
          "↩": `Press Enter/Space to view more details.`,
        }}
      />
    </>
  )
}
