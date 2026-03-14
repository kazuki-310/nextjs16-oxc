"use client";

import { Group, Switch, Paper } from "@mantine/core";
import { useQueryState, parseAsArrayOf, parseAsString } from "nuqs";

import { columnDefs } from "./columns";

export function ColumnVisibilityControl(): React.JSX.Element {
  const [hiddenColumns, setHiddenColumns] = useQueryState(
    "hidden",
    parseAsArrayOf(parseAsString).withDefault([]),
  );

  const toggle = (key: string, checked: boolean): void => {
    void setHiddenColumns((prev) => (checked ? prev.filter((k) => k !== key) : [...prev, key]));
  };

  return (
    <Paper withBorder p="md">
      <Group gap="sm" wrap="wrap">
        {columnDefs.map(({ key, label }) => {
          const isVisible = !hiddenColumns.includes(key);
          return (
            <Switch
              key={key}
              label={label}
              size="xs"
              checked={isVisible}
              onChange={(e) => toggle(key, e.currentTarget.checked)}
            />
          );
        })}
      </Group>
    </Paper>
  );
}
