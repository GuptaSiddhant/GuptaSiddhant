// import { Text, Box } from "ink";
import open from "open";
import { Box, Newline, Text } from "ink";
import Select, { Item } from "./Select";

import useQuery from "../helpers/useQuery";
import Loading from "./Loading";
import ErrorText from "./Error";
import type { Common, PageProps } from "../types";
import useWindowSize from "../helpers/useWindowSize";
import { useCurrentRoute } from "../routes";

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
      <Box flexDirection="column" flexGrow={1}>
        <Text bold>
          {title.toUpperCase()} <Newline />
        </Text>
        <Select
          isFocused
          items={items}
          limit={limit}
          ItemComponent={Item}
          onSelect={handleSelect}
        />
      </Box>
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

function HelpBox(props: Record<string, string>): JSX.Element {
  return (
    <Box flexDirection="column">
      {Object.entries(props).map(([key, value]) => (
        <Box key={key + value}>
          <Text color="cyan">{key} </Text>
          <Text dimColor>{value}</Text>
        </Box>
      ))}
    </Box>
  );
}
