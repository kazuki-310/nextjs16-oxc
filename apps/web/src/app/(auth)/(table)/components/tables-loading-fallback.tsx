import { Stack } from "@mantine/core";

import { tableConfigs } from "../lib/constants";
import { TableSkeleton } from "./table-skeleton";

const PREVIEW_COUNT = 3;

export function TablesLoadingFallback(): React.JSX.Element {
  return (
    <Stack gap="xl">
      {tableConfigs.slice(0, PREVIEW_COUNT).map((config) => (
        <TableSkeleton key={config.id} title={config.title} />
      ))}
    </Stack>
  );
}
