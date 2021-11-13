import open from "open";
import Select, { Item } from "./Select";

import useQuery from "../helpers/useQuery";
import Loading from "./Loading";
import ErrorText from "./Error";
import useWindowSize from "../helpers/useWindowSize";
import { useCurrentRoute } from "../routes";
import HelpBox from "./HelpBox";
import type { Common, PageProps } from "../types";

export default function Page<T extends Common>({
  query,
  Item,
}: PageProps<T>): JSX.Element {
  const { data = [], loading, error } = useQuery<T[]>(query);
  const { height = 16 } = useWindowSize();
  const { title } = useCurrentRoute();

  if (loading) return <Loading />;
  if (error) return <ErrorText error={error} />;

  const items = data.map((item, i) => ({ item, key: i.toString() }));
  const limit = Math.floor((height - 16) / 4);

  const handleSelect = ({ item }: Item<T>) => {
    if (item.link) open(item.link);
  };

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
  );
}
