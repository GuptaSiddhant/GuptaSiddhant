import React from "react";
import { Box, Text } from "ink";

import useQuery from "../helpers/useQuery";
import Loading from "./Loading";
import ErrorText from "./Error";
import type { PageProps } from "../types";

export default function Page<T>({
  query,
  limit = 5,
  itemBuilder,
}: PageProps<T>): JSX.Element {
  const { data = [], loading, error } = useQuery<T[]>(query);

  if (loading) return <Loading />;
  if (error) return <ErrorText error={error} />;

  return (
    <Box flexDirection="column">
      {data.slice(0, limit).map(itemBuilder)}
      {data.length > limit ? (
        <Text dimColor>{"View more on Website."}</Text>
      ) : null}
    </Box>
  );
}
