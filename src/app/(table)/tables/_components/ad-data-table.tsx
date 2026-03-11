"use client";

import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table";
import { useState } from "react";
import { Table, Text } from "@mantine/core";
import type { AdRow } from "../../_lib/constants";
import { columns } from "../../_components/columns";

type Props = {
  title: string;
  data: AdRow[];
  columnVisibility: VisibilityState;
  onColumnVisibilityChange: (visibility: VisibilityState) => void;
};

const STICKY_COLUMN_ID = "name";

export function AdDataTable({
  title,
  data,
  columnVisibility,
  onColumnVisibilityChange,
}: Props): React.JSX.Element {
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    onColumnVisibilityChange: (updater) => {
      const next = typeof updater === "function" ? updater(columnVisibility) : updater;
      onColumnVisibilityChange(next);
    },
    state: { sorting, columnVisibility },
  });

  const headingId = `table-heading-${title.replace(/\s+/g, "-")}`;

  return (
    <section aria-labelledby={headingId}>
      <Text id={headingId} fz="sm" fw={600} mb="xs">
        {title}
      </Text>
      <div
        style={{
          maxHeight: 660,
          overflow: "auto",
          border: "1px solid var(--mantine-color-default-border)",
          borderRadius: "var(--mantine-radius-sm)",
        }}
      >
        <Table withColumnBorders highlightOnHover>
          <Table.Thead
            style={{
              position: "sticky",
              top: 0,
              zIndex: 20,
              background: "var(--mantine-color-body)",
            }}
          >
            {table.getHeaderGroups().map((headerGroup) => (
              <Table.Tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const isSticky = header.column.id === STICKY_COLUMN_ID;
                  return (
                    <Table.Th
                      key={header.id}
                      style={
                        isSticky
                          ? {
                              position: "sticky",
                              left: 0,
                              zIndex: 30,
                              background: "var(--mantine-color-body)",
                            }
                          : undefined
                      }
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </Table.Th>
                  );
                })}
              </Table.Tr>
            ))}
          </Table.Thead>
          <Table.Tbody>
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <Table.Tr key={row.id}>
                  {row.getVisibleCells().map((cell) => {
                    const isSticky = cell.column.id === STICKY_COLUMN_ID;
                    return (
                      <Table.Td
                        key={cell.id}
                        style={
                          isSticky
                            ? {
                                position: "sticky",
                                left: 0,
                                zIndex: 10,
                                background: "var(--mantine-color-body)",
                              }
                            : undefined
                        }
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </Table.Td>
                    );
                  })}
                </Table.Tr>
              ))
            ) : (
              <Table.Tr>
                <Table.Td
                  colSpan={table.getAllColumns().length}
                  style={{ textAlign: "center", height: 96 }}
                >
                  データがありません
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </div>
    </section>
  );
}
