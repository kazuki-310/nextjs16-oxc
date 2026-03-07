"use client";

import { useState } from "react";
import { type VisibilityState } from "@tanstack/react-table";
import { useQueryStates } from "nuqs";
import { AdDataTableVirtual } from "./ad-data-table-virtual";
import { ColumnVisibilityControl } from "../../_components/column-visibility-control";
import { tableConfigs, tableData } from "../../_lib/constants";
import { filterParsers } from "../../_lib/schema";

export function TablesContentVirtual(): React.JSX.Element {
  const [{ name, minImpressions, minConversions }] = useQueryStates(filterParsers);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const filteredData = tableData.filter((row) => {
    if (name && !row.name.toLowerCase().includes(name.toLowerCase())) return false;
    if (minImpressions > 0 && row.impressions < minImpressions) return false;
    if (minConversions > 0 && row.conversions < minConversions) return false;
    return true;
  });

  return (
    <>
      <ColumnVisibilityControl
        columnVisibility={columnVisibility}
        onColumnVisibilityChange={setColumnVisibility}
      />
      <p className="text-sm text-muted-foreground">{filteredData.length} 件</p>
      {tableConfigs.map((config) => (
        <AdDataTableVirtual
          key={config.id}
          title={config.title}
          data={filteredData}
          columnVisibility={columnVisibility}
          onColumnVisibilityChange={setColumnVisibility}
        />
      ))}
    </>
  );
}
