"use client";

import { type VisibilityState } from "@tanstack/react-table";
import { useQueryState, useQueryStates, parseAsArrayOf, parseAsString } from "nuqs";

import { columnDefs } from "../../_components/columns";
import { filterParsers } from "../../_lib/schema";
import type { AdData } from "../../_server-functions/fetchers/get-ad-data";
import { AdDataTableVirtual } from "./ad-data-table-virtual";

type Props = AdData;

export function TablesContentVirtual({ tableData, tableConfigs }: Props): React.JSX.Element {
  const [{ name, minImpressions, minConversions }] = useQueryStates(filterParsers);
  const [hiddenColumns, setHiddenColumns] = useQueryState(
    "hidden",
    parseAsArrayOf(parseAsString).withDefault([]),
  );

  const columnVisibility: VisibilityState = Object.fromEntries(
    columnDefs.map(({ key }) => [key, !hiddenColumns.includes(key)]),
  );

  const handleColumnVisibilityChange = (visibility: VisibilityState): void => {
    const hidden = Object.entries(visibility)
      .filter(([, visible]) => !visible)
      .map(([key]) => key);
    void setHiddenColumns(hidden);
  };

  const filteredData = tableData.filter((row) => {
    if (name && !row.name.toLowerCase().includes(name.toLowerCase())) return false;
    if (minImpressions > 0 && row.impressions < minImpressions) return false;
    if (minConversions > 0 && row.conversions < minConversions) return false;
    return true;
  });

  return (
    <>
      {tableConfigs.map((config) => (
        <AdDataTableVirtual
          key={config.id}
          title={config.title}
          data={filteredData}
          columnVisibility={columnVisibility}
          onColumnVisibilityChange={handleColumnVisibilityChange}
        />
      ))}
    </>
  );
}
