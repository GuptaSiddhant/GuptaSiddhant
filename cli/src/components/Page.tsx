import { Text, Box } from "ink";
import Select, { IndicatorProps } from "../ink/Select";

import useQuery from "../helpers/useQuery";
import Loading from "./Loading";
import ErrorText from "./Error";
import type { PageProps } from "../types";

export default function Page<T>({
  query,
  limit = 10,
  Item,
}: PageProps<T>): JSX.Element {
  const { data = [], loading, error } = useQuery<T[]>(query);

  if (loading) return <Loading />;
  if (error) return <ErrorText error={error} />;

  const items = data.map((item, i) => ({ item, key: i.toString() }));

  return (
    <Select
      isFocused
      items={items}
      limit={limit}
      ItemComponent={Item}
      IndicatorComponent={Indicator}
    />
  );
}

function Indicator({ selected }: IndicatorProps): JSX.Element {
  return (
    <Box marginRight={1}>
      <Text color="cyan">{selected ? "→" : " "}</Text>
    </Box>
  );
}
